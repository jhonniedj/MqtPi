using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace MqtPi_PC
{
    public partial class Form1 : Form
    {
        [DllImport("user32.dll")]
        static extern bool GetCursorPos(ref Point lpPoint);

        [DllImport("gdi32.dll", CharSet = CharSet.Auto, SetLastError = true, ExactSpelling = true)]
        public static extern int BitBlt(IntPtr hDC, int x, int y, int nWidth, int nHeight, IntPtr hSrcDC, int xSrc, int ySrc, int dwRop);

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            //300; 594
            DNS_resolve();
            Connect();

            brush1 = new SolidBrush(Color.FromArgb(255,0,0,0));
            formGraphics = this.CreateGraphics();
            formGraphics.FillRectangle(brush1, new Rectangle());


            Controls.Add(invisibleButton);
            invisibleButton.Click += delegate { MessageBox.Show("Hello World"); };
            invisibleButton.FlatStyle = FlatStyle.Flat;
            invisibleButton.BackColor = BackColor;
            invisibleButton.FlatAppearance.BorderColor = BackColor;
            invisibleButton.FlatAppearance.MouseOverBackColor = BackColor;
            invisibleButton.FlatAppearance.MouseDownBackColor = BackColor;
            invisibleButton.Size = new Size(50, 50);
            invisibleButton.Location = new Point(139, 227);

        }
        SolidBrush brush1;
        Graphics formGraphics;
        Button invisibleButton = new Button();
        private void pictureBox1_Click(object sender, EventArgs e)
        {
        }

        private void pictureBox1_MouseClick(object sender, MouseEventArgs e)
        {
            GetCursorPos(ref cursor);

            var c = GetColorAt(cursor);

            //this.BackColor = c;
            //DNStextBox.BackColor = Color.FromArgb(c.R, c.G, c.B);
            send(c);

            brush1 = new SolidBrush(c);
            formGraphics = this.CreateGraphics();
            textBox1.Text = trackBar1.Value.ToString();
            textBox2.Text = trackBar2.Value.ToString();
            textBox3.Text = trackBar3.Value.ToString();
            invisibleButton.BackColor = c;
            invisibleButton.FlatAppearance.BorderColor = c;
            invisibleButton.FlatAppearance.MouseOverBackColor = c;
            invisibleButton.FlatAppearance.MouseDownBackColor = c;
            formGraphics.FillRectangle(brush1, new Rectangle(139, 227, 50, 50));
            
            Thread.Sleep(500);
        }

        Point cursor = new Point();
        private void pictureBox1_MouseMove(object sender, MouseEventArgs e)
        {
            GetCursorPos(ref cursor);

            var c = GetColorAt(cursor);

            //this.BackColor = c;
            //DNStextBox.BackColor = Color.FromArgb(c.R, c.G, c.B);
            send(c);
            update(c);

            brush1 = new SolidBrush(c);
            formGraphics = this.CreateGraphics();
            textBox1.Text = trackBar1.Value.ToString();
            textBox2.Text = trackBar2.Value.ToString();
            textBox3.Text = trackBar3.Value.ToString();
            formGraphics.FillRectangle(brush1, new Rectangle(92, 227, 50,50));

        }

        private void send(Color cc)
        {
            Publish(cc.R.ToString(), "gpio/red");
            Publish(cc.G.ToString(), "gpio/green");
            Publish(cc.B.ToString(), "gpio/blue");
        }
        private void update(Color cc)
        {
            trackBar1.Value = cc.R;
            trackBar2.Value = cc.G;
            trackBar3.Value = cc.B;
        }

        Bitmap screenPixel = new Bitmap(1, 1, PixelFormat.Format32bppArgb);
        public Color GetColorAt(Point location)
        {
            using (Graphics gdest = Graphics.FromImage(screenPixel))
            {
                using (Graphics gsrc = Graphics.FromHwnd(IntPtr.Zero))
                {
                    IntPtr hSrcDC = gsrc.GetHdc();
                    IntPtr hDC = gdest.GetHdc();
                    int retval = BitBlt(hDC, 0, 0, 1, 1, hSrcDC, location.X, location.Y, (int)CopyPixelOperation.SourceCopy);
                    gdest.ReleaseHdc();
                    gsrc.ReleaseHdc();
                }
            }

            return screenPixel.GetPixel(0, 0);
        }


        private void trackBar1_Scroll(object sender, EventArgs e)
        {
            //Console.WriteLine("Red: "+trackBar1.Value);
            Publish(trackBar1.Value.ToString(), "gpio/red");
            textBox1.Text = trackBar1.Value.ToString();
        }

        private void trackBar2_Scroll(object sender, EventArgs e)
        {
            //Console.WriteLine("Green: " + trackBar2.Value);
            Publish(trackBar2.Value.ToString(), "gpio/green");
            textBox2.Text = trackBar2.Value.ToString();
        }

        private void trackBar3_Scroll(object sender, EventArgs e)
        {
            //Console.WriteLine("Blue: " + trackBar3.Value);
            Publish(trackBar3.Value.ToString(), "gpio/blue");
            textBox3.Text = trackBar3.Value.ToString();
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {
            //DNS_resolve();
        }

        MqttClient client;
        IPAddress ip_address;
        bool connected = false;
        void Connect()
        {
            // create client instance 
            ip_address = IPAddress.Parse(IPtextBox.Text);//when dns resolve fails
                                                          //DNS_resolve();

            // Ping's the local machine.
            Ping pingSender = new Ping();
            
            IPAddress address = ip_address;
            PingReply reply = pingSender.Send(address,100);
            //PingReply reply = pingSender.Send(DNSeditText.Text);

            if (reply.Status == IPStatus.Success)
            {
                client = new MqttClient(ip_address.ToString());

                string clientId = Guid.NewGuid().ToString();

                client.Connect(clientId);
                IPtextBox.BackColor=Color.DarkGreen;

                connected = true;
                Console.WriteLine("Address: {0}", reply.Address.ToString());
                Console.WriteLine("RoundTrip time: {0}", reply.RoundtripTime);
                Console.WriteLine("Time to live: {0}", reply.Options.Ttl);
                Console.WriteLine("Don't fragment: {0}", reply.Options.DontFragment);
                Console.WriteLine("Buffer size: {0}", reply.Buffer.Length);
                Subscribe();
            }
            else
            {
                connected = false;
                Console.WriteLine(reply.Status);
                IPtextBox.BackColor = Color.DarkRed;
                MessageBox.Show("Did not connect!", "Ping!");
            }
        }

        void DNS_resolve()
        {
            //Console.WriteLine("DNS SET TO:" + DNSeditText.Text);
            IPAddress ip = ip_address;

            try
            {
                IPHostEntry host;
                host = Dns.GetHostEntry(DNStextBox.Text);
                Console.WriteLine("GetHostEntry({0}) returns:", DNStextBox.Text);
                foreach (IPAddress ipip in host.AddressList)
                {
                    Console.WriteLine("    {0}", ipip);
                }

            }
            catch (SocketException e)
            {
                Console.WriteLine("SocketException caught!!!");
                Console.WriteLine("Source : " + e.Source);
                Console.WriteLine("Message : " + e.Message);

                MessageBox.Show(e.Message, "DNS Resolve");
            }

            try
            {
                IPHostEntry hostInfo = Dns.GetHostEntry(DNStextBox.Text);
                IPAddress[] address = hostInfo.AddressList;

                if (address.Length > 0) { ip_address = address[0]; ip = address[0]; }
            }
            catch { }

            //if (ip == ip_address) { Console.WriteLine("IP THA SAME"); }
            //Console.WriteLine("IP SET TO:" + ip_address);
            //RunOnUiThread(() => {  });
            if (ip_address != null) { IPtextBox.Text = ip_address.ToString(); }
        }


        void Subscribe()//string topic
        {
            if (connected)
            {
                // register to message received
                client.MqttMsgPublishReceived += client_MqttMsgPublishReceived;
                //string clientId = Guid.NewGuid().ToString();
                //client.Connect(clientId);

                // subscribe to the topic "/home/temperature" with QoS 2
                client.Subscribe(new string[] { "deur" }, new byte[] { MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE });
            }
        }
        void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            string output = Encoding.UTF8.GetString(e.Message);
            Console.WriteLine(output);

            if (output.Contains("tring!"))
            {
                MessageBox.Show("Er staat iemand bij de deur!", "Deurbel");
            }
            ///DNSeditText.Text = output;
            // handle message received
        }

        void Publish(string message, string topic)
        {
            if (connected)
            {
                string strValue = Convert.ToString(message);

                // publish a message on "/home/temperature" topic with QoS 2 
                client.Publish(topic, Encoding.UTF8.GetBytes(strValue), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
            }
        }
        private void label1_Click(object sender, EventArgs e)
        {
            DNS_resolve();
        }

        private void label2_Click(object sender, EventArgs e)
        {
            Connect();
        }



        private void button1_Click(object sender, EventArgs e)
        {
            Publish("1", "gpio/lamp");
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Publish("0", "gpio/lamp");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            Publish("1", "gpio/amp");
        }

        private void button3_Click(object sender, EventArgs e)
        {
            Publish("0", "gpio/amp");
        }
    }
}
