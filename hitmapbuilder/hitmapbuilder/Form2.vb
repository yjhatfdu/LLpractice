Imports Newtonsoft.Json
Imports System.Net
Public Class Form2

    Dim notelist As New List(Of note)
    Dim offset = 0
    Dim lastbmp = 60000
    Dim webserver As Process


    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        If DataGridView1.CurrentRow IsNot Nothing Then
            Try
                DataGridView1.Rows.Remove(DataGridView1.CurrentRow)
            Catch
            End Try
        End If
    End Sub

    Function getjsonstring()
        tabletolist()
        For Each i In notelist
            i.starttime *= mmpb()
            i.endtime *= mmpb()
        Next


        Dim jsonstring As String
        Dim result As New hitmapdata
        result.offsettime = Val(TextBox1.Text)
        ReDim result.lane(8)

        For i = 0 To 8
            Dim collection = From l In notelist Where l.lane = i Order By l.starttime Ascending

            ReDim result.lane(i)(collection.Count - 1)
            For j = 0 To collection.Count - 1
                result.lane(i)(j) = collection(j)
            Next
        Next
        result.speed = TextBox5.Text
        result.audiofile = TextBox3.Text
        result.liveinfo = TextBox2.Text
        result.fps = TextBox4.Text
        jsonstring = JsonConvert.SerializeObject(result)
        Return jsonstring
    End Function
    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        If TextBox3.Text = "" Then
            MsgBox("歌曲文件名不能为空")
            Return
        End If
        If RadioButton2.Checked = True Then
            RadioButton1.Checked = True
        End If
        SaveFileDialog1.ShowDialog()
        Dim sw As New IO.StreamWriter(SaveFileDialog1.OpenFile)
        sw.Write(getjsonstring)
        sw.Close()



    End Sub

    Private Sub Button3_Click(sender As Object, e As EventArgs) Handles Button3.Click
        DataGridView1.Rows.Clear()
        notelist.Clear()
        OpenFileDialog1.ShowDialog()
        Dim sr As New IO.StreamReader(OpenFileDialog1.OpenFile)
        Dim data = sr.ReadToEnd
        sr.Close()
        Dim loaddata As New hitmapdata
        loaddata = JsonConvert.DeserializeObject(Of hitmapdata)(data)
        Dim collection As New List(Of note)
        For Each i In loaddata.lane
            For Each j In i
                collection.Add(j)
            Next
        Next


        RadioButton1.Checked = True
        RadioButton2.Checked = False




        offset = loaddata.offsettime
        TextBox1.Text = loaddata.offsettime
        TextBox2.Text = loaddata.liveinfo
        TextBox4.Text = loaddata.fps
        TextBox5.Text = loaddata.speed
        TextBox3.Text = loaddata.audiofile
        notelist.AddRange((From i In collection Order By i.starttime Ascending).ToArray())
        listtotable()

    End Sub
    Function mmpb() As Double
        If TextBox6.Text IsNot Nothing Then
            Return 60000 / Val(TextBox6.Text)
        End If

    End Function
    Private Sub tabletolist()
        notelist.Clear()
        For Each i As DataGridViewRow In DataGridView1.Rows
            If i.Cells(1).Value = 0 Then
                Continue For
            End If
            Dim newnote As New note
            newnote.starttime = i.Cells(1).Value
            Dim endtime = i.Cells(2).Value
            If endtime = 0 Then
                newnote.endtime = newnote.starttime
            Else
                newnote.endtime = endtime
            End If
            newnote.longnote = i.Cells(3).Value
            newnote.parallel = i.Cells(4).Value
            newnote.lane = i.Cells(5).Value - 1
            notelist.Add(newnote)


        Next


    End Sub
    Private Sub listtotable()
        DataGridView1.Rows.Clear()
        For Each i In notelist
            DataGridView1.Rows.Add(0, i.starttime, i.endtime, i.longnote, i.parallel, i.lane + 1)
        Next
    End Sub
    Private Sub fftomm()
        If RadioButton1.Checked Then
            Dim mspf = 1000 / Val(TextBox4.Text)
            For Each i In notelist

                i.starttime = (i.starttime \ 100) * 1000 + (i.starttime Mod 100) * mspf
                i.endtime = (i.endtime \ 100) * 1000 + (i.endtime Mod 100) * mspf
            Next
        End If

    End Sub
    Private Sub mmtoff()
        If RadioButton2.Checked Then
            Dim mspf = 1000 / Val(TextBox4.Text)
            For Each i In notelist
                i.starttime = (i.starttime \ 1000) * 100 + (i.starttime Mod 1000) / mspf
                i.endtime = (i.endtime \ 1000) * 100 + (i.endtime Mod 1000) / mspf
            Next
        End If
    End Sub


    Private Sub RadioButton1_CheckedChanged(sender As Object, e As EventArgs) Handles RadioButton1.CheckedChanged
        If RadioButton1.Checked Then
            tabletolist()
            mmtoff()
            listtotable()
        End If
    End Sub

    Private Sub RadioButton2_CheckedChanged(sender As Object, e As EventArgs) Handles RadioButton2.CheckedChanged
        If RadioButton2.Checked Then
            tabletolist()
            mmtoff()
            listtotable()
        End If
    End Sub


    Private Sub Toffsettimechange(sender As Object, e As EventArgs) Handles TextBox1.TextChanged
        If TextBox1.Text = "" Then
            Return
        End If
        tabletolist()
        RadioButton1.Checked = True
        Dim tempoffset = Val(TextBox1.Text) - offset
        For Each i In notelist
            i.starttime += tempoffset
            i.endtime += tempoffset
        Next
        offset = Val(TextBox1.Text)
        listtotable()
    End Sub
    Dim pid As Integer
    Private Sub Form2_Load(sender As Object, e As EventArgs) Handles MyBase.Shown
        webserver = Process.Start("webdev.webserver40.exe", "/port:8080 /path:""" & Application.StartupPath & """")
        '  Shell("cmd.exe")
    End Sub


    Private Sub DataGridView1_CellContentClick() Handles DataGridView1.RowsAdded
        For i = 1 To DataGridView1.Rows.Count
            DataGridView1.Rows.Item(i - 1).Cells(0).Value = i
        Next

    End Sub
    Private Sub rowdel() Handles DataGridView1.RowsRemoved
        For i = 1 To DataGridView1.Rows.Count
            DataGridView1.Rows.Item(i - 1).Cells(0).Value = i
        Next
    End Sub

    Private Sub Button4_Click(sender As Object, e As EventArgs) Handles Button4.Click
        If RadioButton2.Checked = True Then
            RadioButton1.Checked = True
        End If
        Dim savefile As New IO.FileStream(Application.StartupPath & "\data.js", IO.FileMode.Create)
        Dim strw As New IO.StreamWriter(savefile)
        strw.Write(getjsonstring)
        strw.Close()
        savefile.Close()
        Process.Start("http://127.0.0.1:8080/index.html")
    End Sub
    Private Sub onend() Handles Me.FormClosing
        webserver.Kill()
    End Sub

    Private Sub TextBox6_TextChanged(sender As Object, e As EventArgs) Handles TextBox6.TextChanged
        If TextBox6.Text IsNot Nothing And Val(TextBox6.Text) <> 0 Then
            tabletolist()
            For Each i In notelist
                i.starttime *= 60000 / lastbmp / mmpb()
                i.endtime *= 60000 / lastbmp / mmpb()
            Next
            listtotable()
            lastbmp = Val(TextBox6.Text)
        End If
    End Sub
End Class