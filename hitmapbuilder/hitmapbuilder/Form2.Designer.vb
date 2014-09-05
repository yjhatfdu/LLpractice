<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Partial Class Form2
    Inherits System.Windows.Forms.Form

    'Form 重写 Dispose，以清理组件列表。
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Windows 窗体设计器所必需的
    Private components As System.ComponentModel.IContainer

    '注意:  以下过程是 Windows 窗体设计器所必需的
    '可以使用 Windows 窗体设计器修改它。  
    '不要使用代码编辑器修改它。
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.SplitContainer1 = New System.Windows.Forms.SplitContainer()
        Me.DataGridView1 = New System.Windows.Forms.DataGridView()
        Me.Column1 = New System.Windows.Forms.DataGridViewTextBoxColumn()
        Me.start = New System.Windows.Forms.DataGridViewTextBoxColumn()
        Me.endtimecol = New System.Windows.Forms.DataGridViewTextBoxColumn()
        Me.longnotecol = New System.Windows.Forms.DataGridViewCheckBoxColumn()
        Me.parallelcol = New System.Windows.Forms.DataGridViewCheckBoxColumn()
        Me.lanecol = New System.Windows.Forms.DataGridViewTextBoxColumn()
        Me.Label7 = New System.Windows.Forms.Label()
        Me.Button4 = New System.Windows.Forms.Button()
        Me.Button3 = New System.Windows.Forms.Button()
        Me.Label6 = New System.Windows.Forms.Label()
        Me.TextBox5 = New System.Windows.Forms.TextBox()
        Me.Label5 = New System.Windows.Forms.Label()
        Me.TextBox4 = New System.Windows.Forms.TextBox()
        Me.Label4 = New System.Windows.Forms.Label()
        Me.Button1 = New System.Windows.Forms.Button()
        Me.TextBox3 = New System.Windows.Forms.TextBox()
        Me.Label3 = New System.Windows.Forms.Label()
        Me.TextBox2 = New System.Windows.Forms.TextBox()
        Me.Label2 = New System.Windows.Forms.Label()
        Me.Label1 = New System.Windows.Forms.Label()
        Me.TextBox1 = New System.Windows.Forms.TextBox()
        Me.GroupBox1 = New System.Windows.Forms.GroupBox()
        Me.RadioButton2 = New System.Windows.Forms.RadioButton()
        Me.RadioButton1 = New System.Windows.Forms.RadioButton()
        Me.Button2 = New System.Windows.Forms.Button()
        Me.SaveFileDialog1 = New System.Windows.Forms.SaveFileDialog()
        Me.OpenFileDialog1 = New System.Windows.Forms.OpenFileDialog()
        Me.Label8 = New System.Windows.Forms.Label()
        Me.TextBox6 = New System.Windows.Forms.TextBox()
        CType(Me.SplitContainer1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SplitContainer1.Panel1.SuspendLayout()
        Me.SplitContainer1.Panel2.SuspendLayout()
        Me.SplitContainer1.SuspendLayout()
        CType(Me.DataGridView1, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.GroupBox1.SuspendLayout()
        Me.SuspendLayout()
        '
        'SplitContainer1
        '
        Me.SplitContainer1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.SplitContainer1.Location = New System.Drawing.Point(0, 0)
        Me.SplitContainer1.Name = "SplitContainer1"
        '
        'SplitContainer1.Panel1
        '
        Me.SplitContainer1.Panel1.Controls.Add(Me.DataGridView1)
        '
        'SplitContainer1.Panel2
        '
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label7)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Button4)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Button3)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label6)
        Me.SplitContainer1.Panel2.Controls.Add(Me.TextBox5)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label5)
        Me.SplitContainer1.Panel2.Controls.Add(Me.TextBox4)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label4)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Button1)
        Me.SplitContainer1.Panel2.Controls.Add(Me.TextBox3)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label3)
        Me.SplitContainer1.Panel2.Controls.Add(Me.TextBox2)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label2)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Label1)
        Me.SplitContainer1.Panel2.Controls.Add(Me.TextBox1)
        Me.SplitContainer1.Panel2.Controls.Add(Me.GroupBox1)
        Me.SplitContainer1.Panel2.Controls.Add(Me.Button2)
        Me.SplitContainer1.Size = New System.Drawing.Size(1089, 546)
        Me.SplitContainer1.SplitterDistance = 758
        Me.SplitContainer1.TabIndex = 0
        '
        'DataGridView1
        '
        Me.DataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize
        Me.DataGridView1.Columns.AddRange(New System.Windows.Forms.DataGridViewColumn() {Me.Column1, Me.start, Me.endtimecol, Me.longnotecol, Me.parallelcol, Me.lanecol})
        Me.DataGridView1.Dock = System.Windows.Forms.DockStyle.Fill
        Me.DataGridView1.Location = New System.Drawing.Point(0, 0)
        Me.DataGridView1.Name = "DataGridView1"
        Me.DataGridView1.RowTemplate.Height = 23
        Me.DataGridView1.Size = New System.Drawing.Size(758, 546)
        Me.DataGridView1.TabIndex = 0
        '
        'Column1
        '
        Me.Column1.HeaderText = "id"
        Me.Column1.Name = "Column1"
        Me.Column1.ReadOnly = True
        '
        'start
        '
        Me.start.DataPropertyName = "starttime"
        Me.start.HeaderText = "开始时间"
        Me.start.Name = "start"
        '
        'endtimecol
        '
        Me.endtimecol.DataPropertyName = "endtime"
        Me.endtimecol.HeaderText = "结束时间"
        Me.endtimecol.Name = "endtimecol"
        '
        'longnotecol
        '
        Me.longnotecol.DataPropertyName = "longnote"
        Me.longnotecol.HeaderText = "长音符"
        Me.longnotecol.Name = "longnotecol"
        Me.longnotecol.Resizable = System.Windows.Forms.DataGridViewTriState.[True]
        Me.longnotecol.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.Automatic
        '
        'parallelcol
        '
        Me.parallelcol.DataPropertyName = "parallel"
        Me.parallelcol.HeaderText = "同时标记"
        Me.parallelcol.Name = "parallelcol"
        Me.parallelcol.Resizable = System.Windows.Forms.DataGridViewTriState.[True]
        Me.parallelcol.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.Automatic
        Me.parallelcol.Width = 150
        '
        'lanecol
        '
        Me.lanecol.DataPropertyName = "lane"
        Me.lanecol.HeaderText = "方向(左1-9右)"
        Me.lanecol.Name = "lanecol"
        Me.lanecol.Width = 150
        '
        'Label7
        '
        Me.Label7.Location = New System.Drawing.Point(199, 13)
        Me.Label7.Name = "Label7"
        Me.Label7.Size = New System.Drawing.Size(96, 28)
        Me.Label7.TabIndex = 0
        Me.Label7.Text = "(请把默认浏览器设为chrome）"
        '
        'Button4
        '
        Me.Button4.Location = New System.Drawing.Point(117, 12)
        Me.Button4.Name = "Button4"
        Me.Button4.Size = New System.Drawing.Size(75, 23)
        Me.Button4.TabIndex = 16
        Me.Button4.Text = "测试"
        Me.Button4.UseVisualStyleBackColor = True
        '
        'Button3
        '
        Me.Button3.Location = New System.Drawing.Point(30, 12)
        Me.Button3.Name = "Button3"
        Me.Button3.Size = New System.Drawing.Size(75, 23)
        Me.Button3.TabIndex = 15
        Me.Button3.Text = "打开"
        Me.Button3.UseVisualStyleBackColor = True
        '
        'Label6
        '
        Me.Label6.AutoSize = True
        Me.Label6.Location = New System.Drawing.Point(177, 214)
        Me.Label6.Name = "Label6"
        Me.Label6.Size = New System.Drawing.Size(83, 12)
        Me.Label6.TabIndex = 14
        Me.Label6.Text = "速度(默认128)"
        '
        'TextBox5
        '
        Me.TextBox5.Location = New System.Drawing.Point(179, 240)
        Me.TextBox5.Name = "TextBox5"
        Me.TextBox5.Size = New System.Drawing.Size(51, 21)
        Me.TextBox5.TabIndex = 13
        Me.TextBox5.Text = "128"
        '
        'Label5
        '
        Me.Label5.AutoSize = True
        Me.Label5.Location = New System.Drawing.Point(115, 214)
        Me.Label5.Name = "Label5"
        Me.Label5.Size = New System.Drawing.Size(53, 12)
        Me.Label5.TabIndex = 12
        Me.Label5.Text = "每秒帧数"
        '
        'TextBox4
        '
        Me.TextBox4.Location = New System.Drawing.Point(117, 240)
        Me.TextBox4.Name = "TextBox4"
        Me.TextBox4.Size = New System.Drawing.Size(51, 21)
        Me.TextBox4.TabIndex = 11
        Me.TextBox4.Text = "30"
        '
        'Label4
        '
        Me.Label4.AutoSize = True
        Me.Label4.Location = New System.Drawing.Point(44, 484)
        Me.Label4.Name = "Label4"
        Me.Label4.Size = New System.Drawing.Size(155, 24)
        Me.Label4.TabIndex = 10
        Me.Label4.Text = "请将生成的data.js文件放在" & Global.Microsoft.VisualBasic.ChrW(13) & Global.Microsoft.VisualBasic.ChrW(10) & "index.html同一目录下"
        '
        'Button1
        '
        Me.Button1.Location = New System.Drawing.Point(79, 447)
        Me.Button1.Name = "Button1"
        Me.Button1.Size = New System.Drawing.Size(75, 23)
        Me.Button1.TabIndex = 9
        Me.Button1.Text = "生成"
        Me.Button1.UseVisualStyleBackColor = True
        '
        'TextBox3
        '
        Me.TextBox3.Location = New System.Drawing.Point(30, 394)
        Me.TextBox3.Name = "TextBox3"
        Me.TextBox3.Size = New System.Drawing.Size(184, 21)
        Me.TextBox3.TabIndex = 8
        '
        'Label3
        '
        Me.Label3.AutoSize = True
        Me.Label3.Location = New System.Drawing.Point(77, 369)
        Me.Label3.Name = "Label3"
        Me.Label3.Size = New System.Drawing.Size(65, 12)
        Me.Label3.TabIndex = 7
        Me.Label3.Text = "歌曲文件名"
        '
        'TextBox2
        '
        Me.TextBox2.Location = New System.Drawing.Point(11, 300)
        Me.TextBox2.Multiline = True
        Me.TextBox2.Name = "TextBox2"
        Me.TextBox2.Size = New System.Drawing.Size(219, 54)
        Me.TextBox2.TabIndex = 6
        '
        'Label2
        '
        Me.Label2.AutoSize = True
        Me.Label2.Location = New System.Drawing.Point(9, 285)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(233, 12)
        Me.Label2.TabIndex = 5
        Me.Label2.Text = "歌曲信息（显示在live开头，目前未实现）"
        '
        'Label1
        '
        Me.Label1.AutoSize = True
        Me.Label1.Location = New System.Drawing.Point(9, 214)
        Me.Label1.Name = "Label1"
        Me.Label1.Size = New System.Drawing.Size(101, 12)
        Me.Label1.TabIndex = 4
        Me.Label1.Text = "时间偏移（毫秒）"
        '
        'TextBox1
        '
        Me.TextBox1.Location = New System.Drawing.Point(10, 240)
        Me.TextBox1.Name = "TextBox1"
        Me.TextBox1.Size = New System.Drawing.Size(63, 21)
        Me.TextBox1.TabIndex = 3
        Me.TextBox1.Text = "0"
        '
        'GroupBox1
        '
        Me.GroupBox1.Controls.Add(Me.TextBox6)
        Me.GroupBox1.Controls.Add(Me.Label8)
        Me.GroupBox1.Controls.Add(Me.RadioButton2)
        Me.GroupBox1.Controls.Add(Me.RadioButton1)
        Me.GroupBox1.Location = New System.Drawing.Point(30, 44)
        Me.GroupBox1.Name = "GroupBox1"
        Me.GroupBox1.Size = New System.Drawing.Size(200, 87)
        Me.GroupBox1.TabIndex = 2
        Me.GroupBox1.TabStop = False
        Me.GroupBox1.Text = "时间单位"
        '
        'RadioButton2
        '
        Me.RadioButton2.AutoSize = True
        Me.RadioButton2.Location = New System.Drawing.Point(16, 55)
        Me.RadioButton2.Name = "RadioButton2"
        Me.RadioButton2.Size = New System.Drawing.Size(53, 16)
        Me.RadioButton2.TabIndex = 1
        Me.RadioButton2.TabStop = True
        Me.RadioButton2.Text = "秒+帧"
        Me.RadioButton2.UseVisualStyleBackColor = True
        '
        'RadioButton1
        '
        Me.RadioButton1.AutoSize = True
        Me.RadioButton1.Checked = True
        Me.RadioButton1.Location = New System.Drawing.Point(16, 20)
        Me.RadioButton1.Name = "RadioButton1"
        Me.RadioButton1.Size = New System.Drawing.Size(47, 16)
        Me.RadioButton1.TabIndex = 0
        Me.RadioButton1.TabStop = True
        Me.RadioButton1.Text = "毫秒"
        Me.RadioButton1.UseVisualStyleBackColor = True
        '
        'Button2
        '
        Me.Button2.Location = New System.Drawing.Point(79, 157)
        Me.Button2.Name = "Button2"
        Me.Button2.Size = New System.Drawing.Size(75, 23)
        Me.Button2.TabIndex = 1
        Me.Button2.Text = "删除当前行"
        Me.Button2.UseVisualStyleBackColor = True
        '
        'SaveFileDialog1
        '
        Me.SaveFileDialog1.FileName = "data.js"
        '
        'OpenFileDialog1
        '
        Me.OpenFileDialog1.FileName = "OpenFileDialog1"
        '
        'Label8
        '
        Me.Label8.AutoSize = True
        Me.Label8.Location = New System.Drawing.Point(97, 20)
        Me.Label8.Name = "Label8"
        Me.Label8.Size = New System.Drawing.Size(95, 24)
        Me.Label8.TabIndex = 2
        Me.Label8.Text = "BPM（如果要毫秒" & Global.Microsoft.VisualBasic.ChrW(13) & Global.Microsoft.VisualBasic.ChrW(10) & "则为60000）"
        '
        'TextBox6
        '
        Me.TextBox6.Location = New System.Drawing.Point(92, 50)
        Me.TextBox6.Name = "TextBox6"
        Me.TextBox6.Size = New System.Drawing.Size(100, 21)
        Me.TextBox6.TabIndex = 3
        Me.TextBox6.Text = "60000"
        '
        'Form2
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 12.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(1089, 546)
        Me.Controls.Add(Me.SplitContainer1)
        Me.Name = "Form2"
        Me.Text = "Form2"
        Me.SplitContainer1.Panel1.ResumeLayout(False)
        Me.SplitContainer1.Panel2.ResumeLayout(False)
        Me.SplitContainer1.Panel2.PerformLayout()
        CType(Me.SplitContainer1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.SplitContainer1.ResumeLayout(False)
        CType(Me.DataGridView1, System.ComponentModel.ISupportInitialize).EndInit()
        Me.GroupBox1.ResumeLayout(False)
        Me.GroupBox1.PerformLayout()
        Me.ResumeLayout(False)

    End Sub
    Friend WithEvents SplitContainer1 As System.Windows.Forms.SplitContainer
    Friend WithEvents DataGridView1 As System.Windows.Forms.DataGridView
    Friend WithEvents Button2 As System.Windows.Forms.Button
    Friend WithEvents GroupBox1 As System.Windows.Forms.GroupBox
    Friend WithEvents RadioButton2 As System.Windows.Forms.RadioButton
    Friend WithEvents RadioButton1 As System.Windows.Forms.RadioButton
    Friend WithEvents Label4 As System.Windows.Forms.Label
    Friend WithEvents Button1 As System.Windows.Forms.Button
    Friend WithEvents TextBox3 As System.Windows.Forms.TextBox
    Friend WithEvents Label3 As System.Windows.Forms.Label
    Friend WithEvents TextBox2 As System.Windows.Forms.TextBox
    Friend WithEvents Label2 As System.Windows.Forms.Label
    Friend WithEvents Label1 As System.Windows.Forms.Label
    Friend WithEvents TextBox1 As System.Windows.Forms.TextBox
    Friend WithEvents Label5 As System.Windows.Forms.Label
    Friend WithEvents TextBox4 As System.Windows.Forms.TextBox
    Friend WithEvents SaveFileDialog1 As System.Windows.Forms.SaveFileDialog
    Friend WithEvents Label6 As System.Windows.Forms.Label
    Friend WithEvents TextBox5 As System.Windows.Forms.TextBox
    Friend WithEvents Button3 As System.Windows.Forms.Button
    Friend WithEvents OpenFileDialog1 As System.Windows.Forms.OpenFileDialog
    Friend WithEvents Column1 As System.Windows.Forms.DataGridViewTextBoxColumn
    Friend WithEvents start As System.Windows.Forms.DataGridViewTextBoxColumn
    Friend WithEvents endtimecol As System.Windows.Forms.DataGridViewTextBoxColumn
    Friend WithEvents longnotecol As System.Windows.Forms.DataGridViewCheckBoxColumn
    Friend WithEvents parallelcol As System.Windows.Forms.DataGridViewCheckBoxColumn
    Friend WithEvents lanecol As System.Windows.Forms.DataGridViewTextBoxColumn
    Friend WithEvents Label7 As System.Windows.Forms.Label
    Friend WithEvents Button4 As System.Windows.Forms.Button
    Friend WithEvents Label8 As System.Windows.Forms.Label
    Friend WithEvents TextBox6 As System.Windows.Forms.TextBox
End Class
