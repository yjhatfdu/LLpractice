Imports Newtonsoft.Json

Public Class Form1
    Dim notelist As New List(Of note)
    Private Sub TrackBar1_Scroll(sender As Object, e As EventArgs) Handles TrackBar1.Scroll
        Label4.Text = TrackBar1.Value

    End Sub

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        Dim newnote As New note
        newnote.starttime = TextBox1.Text
        newnote.endtime = TextBox2.Text
        newnote.longnote = CheckBox1.Checked
        newnote.parallel = CheckBox2.Checked
        newnote.lane = TrackBar1.Value
        notelist.Add(newnote)
        ListBox1.Items.Add(newnote.ToString)
    End Sub

    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        If ListBox1.SelectedIndex >= 0 Then
            notelist.RemoveAt(ListBox1.SelectedIndex)
            ListBox1.Items.RemoveAt(ListBox1.SelectedIndex)
        End If
  
    End Sub

    Private Sub Button3_Click(sender As Object, e As EventArgs) Handles Button3.Click
        Dim jsonstring As String
        Dim result As New hitmapdata
        ReDim result.lane(8)
        For Each i In notelist
            i.starttime -= TextBox5.Text
            i.endtime -= TextBox5.Text
        Next
        For i = 0 To 8
            Dim collection = From l In notelist Where l.lane = i Order By l.starttime Ascending

            ReDim result.lane(i)(collection.Count - 1)
            For j = 0 To collection.Count - 1
                result.lane(i)(j) = collection(j)
            Next
        Next
        result.speed = TextBox4.Text
        result.audiofile = TextBox3.Text
        jsonstring = JsonConvert.SerializeObject(result)
        SaveFileDialog1.ShowDialog()
        Dim sw As New IO.StreamWriter(SaveFileDialog1.OpenFile)
        sw.Write(jsonstring)
        sw.Close()
    End Sub



    Private Sub Button4_Click(sender As Object, e As EventArgs) Handles Button4.Click
        OpenFileDialog1.ShowDialog()
        Dim sr As New IO.StreamReader(OpenFileDialog1.OpenFile)
        Dim data = sr.ReadToEnd
        sr.Close()
        Dim notesstring() = data.Split(vbCrLf)
        For i = 1 To UBound(notesstring)
            Dim singlenote() = notesstring(i).Split(";")
            Dim newnote As New note
            newnote.starttime = singlenote(0)
            Dim mm = newnote.starttime Mod 100
            newnote.starttime = Int(newnote.starttime / 100) * 1000 + mm * 33.3
            If singlenote(1) = "" Then
                newnote.endtime = newnote.starttime
            Else
                newnote.endtime = singlenote(1)
                Dim em = newnote.endtime Mod 100
                newnote.endtime = Int(newnote.endtime / 100) * 1000 + mm * 33.3

            End If
            If singlenote(2) = "" Then
                newnote.longnote = False
            Else
                newnote.longnote = True
            End If
            If singlenote(3) = "" Then
                newnote.parallel = False
            Else
                newnote.parallel = True
            End If
            newnote.lane = singlenote(4)
            notelist.Add(newnote)
            ListBox1.Items.Add(newnote.ToString)
        Next
    End Sub
End Class

Public Class note
    Public starttime As Double
    Public endtime As Double
    Public longnote As Boolean
    Public parallel As Boolean
    Public hold As Boolean
    Public lane As Integer
    Public Overrides Function ToString() As String
        Return String.Format("start:{0}     end:{1}     long:{2}    parallel:{3}    lane:{4}", starttime, endtime, longnote, parallel, lane)
    End Function
End Class
Public Class hitmapdata
    Public audiofile As String
    Public liveinfo As String
    Public speed As Double
    Public offsettime As Double
    Public lane()() As note
    Public fps As Double

End Class
