using Android.App;
using Android.Widget;
using Android.OS;
using Android.Gms.Common;
using Android.Content;
using Android.Graphics;
using Android.Util;

using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

using Firebase.Messaging;
using Firebase.Iid;

using System;
using System.Net;
using System.Text;
using System.Threading;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Android.Support.V4.App;
using Android.Views;

namespace MqtPi
{
    [Activity(Label = "MqtPi", MainLauncher = true, Icon = "@drawable/icon")]
    class MainActivity : Activity
    {
        //public static event EventHandler _show;
        const string TAG = "MainActivity";

        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.Main);

            ctx = this;
            myVib = (Vibrator)GetSystemService(VibratorService);

            //some firebase balls
            if (Intent.Extras != null)
            {
                foreach (var key in Intent.Extras.KeySet())
                {
                    var value = Intent.Extras.GetString(key);
                    Log.Debug(TAG, "Key: {0} Value: {1}", key, value);
                }
            }
            //IsPlayServicesAvailable();//not used..
            //till here

            button_init();

            DNS_resolve();
            Connect();
            //myVib.Vibrate(500);//for debug, because of massive buildtime
        }
        protected override void OnResume()
        {
            base.OnResume();
            //makeToast("BELLO! =)");
            Connect();
            //FB_Subscribe();
            //Subscribe();
        }
        public static void makeToast(string str)
        {
            Toast.MakeText(ctx, str, ToastLength.Long).Show();
            //myVib.Vibrate(100);
        }

        void FB_Subscribe(string topic = "all")
        {
            try
            {
                if (topic == "all")
                {
                    FirebaseMessaging.Instance.SubscribeToTopic("news");
                    FirebaseMessaging.Instance.SubscribeToTopic("deur");
                }
                else { FirebaseMessaging.Instance.SubscribeToTopic(topic); }
            }
            catch {; };
        }

        EditText DNSeditText, IPeditText;
        TextView msgText;
        TextView debugText;
        SeekBar seekBar1;
        Button button_connect;

        public void button_init()
        {
            msgText = FindViewById<TextView>(Resource.Id.msgText);
            debugText = FindViewById<TextView>(Resource.Id.debugText);

            DNSeditText = FindViewById<EditText>(Resource.Id.DNSeditText);
            IPeditText = FindViewById<EditText>(Resource.Id.IPeditText);

            Button alarmviewButton = FindViewById<Button>(Resource.Id.alarmviewButton);
            alarmviewButton.Click += delegate
            {
                Publish("get", "gpio/alarm/time_get");
                StartActivity(typeof(alarm));
            };
            Button settingsviewButton = FindViewById<Button>(Resource.Id.settingsviewButton);
            settingsviewButton.Click += delegate { };//StartActivity(typeof(alarm)); };

            Button button1_0 = FindViewById<Button>(Resource.Id.button1_0);
            button1_0.Click += delegate { button1_0_click(); };
            Button button1_1 = FindViewById<Button>(Resource.Id.button1_1);
            button1_1.Click += delegate { button1_1_click(); };
            Button button2_0 = FindViewById<Button>(Resource.Id.button2_0);
            button2_0.Click += delegate { button2_0_click(); };
            Button button2_1 = FindViewById<Button>(Resource.Id.button2_1);
            button2_1.Click += delegate { button2_1_click(); };

            Button button1 = FindViewById<Button>(Resource.Id.button1);
            button1.Click += delegate { button1_click(); };
            Button button2 = FindViewById<Button>(Resource.Id.button2);
            button2.Click += delegate { button2_click(); };
            Button button3 = FindViewById<Button>(Resource.Id.button3);
            button3.Click += delegate { button3_click(); };
            Button button4 = FindViewById<Button>(Resource.Id.button4);
            button4.Click += delegate { button4_click(); };
            Button button5 = FindViewById<Button>(Resource.Id.button5);
            button5.Click += delegate { button5_click(); };
            Button button6 = FindViewById<Button>(Resource.Id.button6);
            button6.Click += delegate { button6_click(); };

            Button button_resolve = FindViewById<Button>(Resource.Id.button_resolve);
            button_resolve.Click += delegate { button_resolve_click(); };

            button_connect = FindViewById<Button>(Resource.Id.button_connect);
            button_connect.Click += delegate { button_connect_click(); };

            seekBar1 = FindViewById<SeekBar>(Resource.Id.seekBar1);
            seekBar1.ProgressChanged += delegate { seekbar1_changed(); };
        }
        void FB_Unsubscribe()
        {
            FirebaseMessaging.Instance.UnsubscribeFromTopic("news");
            FirebaseMessaging.Instance.UnsubscribeFromTopic("deur");
        }
        void DNS_resolve()
        {
            //Console.WriteLine("DNS SET TO:" + DNSeditText.Text);
            IPAddress ip = ip_address;

            try
            {
                IPHostEntry host;
                host = Dns.GetHostEntry(DNSeditText.Text);
                Console.WriteLine("GetHostEntry({0}) returns:", DNSeditText.Text);
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

                popup("DNS Resolve", e.Message);
            }

            try
            {
                IPHostEntry hostInfo = Dns.GetHostEntry(DNSeditText.Text);
                IPAddress[] address = hostInfo.AddressList;

                if (address.Length > 0) { ip_address = address[0]; ip = address[0]; }
            }
            catch { }

            //if (ip == ip_address) { Console.WriteLine("IP THA SAME"); }
            //Console.WriteLine("IP SET TO:" + ip_address);
            //RunOnUiThread(() => {  });
            if (ip_address != null) { IPeditText.Text = ip_address.ToString(); }
        }

        void popup(string title, string message)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.SetMessage(message)
                   .SetTitle(title);
            builder.SetCancelable(true);
            builder.SetPositiveButton("OK", delegate {; });
            builder.Show();
            AlertDialog dialog = builder.Create();
            dialog.Dismiss();
        }
        void seekbar1_changed()
        {
            Publish(seekBar1.Progress.ToString(), "gpio/led/dimmer");
        }

        void button1_0_click()
        {
            Publish("1", "gpio/amp");
        }
        void button1_1_click()
        {
            Publish("0", "gpio/amp");
        }
        void button2_0_click()
        {
            Publish("1", "gpio/lamp");
        }
        void button2_1_click()
        {
            Publish("0", "gpio/lamp");
        }
        void button1_click()
        {
            Publish("1", "gpio/led");
        }
        void button2_click()
        {
            Publish("0", "gpio/led");
        }
        void button3_click()
        {
            Publish("sleep", "gpio/led");
        }
        void button4_click()
        {
            Publish("dimm", "gpio/led");
        }
        void button5_click()
        {
            Publish("2", "gpio/led");
        }
        void button6_click()
        {
            Connect();
            for (int i = 1; i <= 50; i++)
            {
                Thread.Sleep(20);
                Publish("0", "gpio/led");
                Thread.Sleep(20);
                Publish("1", "gpio/led");
            }
        }
        void button_resolve_click()
        {
            DNS_resolve();
        }

        void button_connect_click()
        {
            Connect();
        }

        public static MqttClient client;
        IPAddress ip_address;
        public static bool connected = false;
        void Connect()
        {
            // create client instance 
            ip_address = IPAddress.Parse(IPeditText.Text);//when dns resolve fails
                                                          //DNS_resolve();
                                                          // Ping's the local machine.
            Ping pingSender = new Ping();
            IPAddress address = ip_address;
            PingReply reply = pingSender.Send(address, 100);

            if (reply.Status == IPStatus.Success)
            {
                client = new MqttClient(ip_address.ToString());

                string clientId = Guid.NewGuid().ToString();

                client.Connect(clientId);
                button_connect.SetBackgroundColor(Color.DarkGreen);

                connected = true;
                Console.WriteLine("Address: {0}", reply.Address.ToString());
                Console.WriteLine("RoundTrip time: {0}", reply.RoundtripTime);
                Console.WriteLine("Time to live: {0}", reply.Options.Ttl);
                Console.WriteLine("Don't fragment: {0}", reply.Options.DontFragment);
                Console.WriteLine("Buffer size: {0}", reply.Buffer.Length);
                FB_Subscribe();
                Subscribe();
            }
            else
            {
                connected = false;
                Console.WriteLine(reply.Status);
                button_connect.SetBackgroundColor(Color.DarkRed);
                popup("Ping!", "Did not connect!");
            }
        }
        void ondisconnect()
        {
            if (!client.IsConnected)
            {
                button_connect.SetBackgroundColor(Color.DarkRed);
            }
        }

        void Publish(string message, string topic)
        {
            Connect();
            if (connected)
            {
                string strValue = Convert.ToString(message);

                // publish a message on "/home/temperature" topic with QoS 2 
                client.Publish(topic, Encoding.UTF8.GetBytes(strValue), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
            }
        }
        public static void Publish_static(string message, string topic)
        {
            //Connect();
            if (connected)
            {
                string strValue = Convert.ToString(message);

                // publish a message on "/home/temperature" topic with QoS 2 
                client.Publish(topic, Encoding.UTF8.GetBytes(strValue), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, false);
            }
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
                //client.Subscribe(new string[] { "deur/#", "gpio/alarm/time" }, new byte[] { MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE });
                client.Subscribe(new string[] { "deur/#", "gpio/alarm/time" }, new byte[] { MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE });
            }
        }
        public static string alarms = "";
        void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            string output = Encoding.UTF8.GetString(e.Message);
            string topic = e.Topic;
            Console.WriteLine("MQTT RECEIVED = Topic: {" + topic + "} Message: {" + output + "}");
            //msgText.Text = output;
            if (topic == "gpio/alarm/time")
            {
                alarms = output;
                RunOnUiThread(() => { debugText.Text = "Topic: {" + topic + "} MSG: {" + output + "}"; });
            }
            else
            {
                RunOnUiThread(() => { msgText.Text = "Topic: {" + topic + "} MSG: {" + output + "}"; });
            }

            //if (output.Contains("tring!"))
            /*
            if (topic.Contains("deur/button"))// not more necessary with firebase..
            {
                static_notification("Deurbel", "Er staat iemand bij de deur!");
            }
            */
            ///DNSeditText.Text = output;
            // handle message received
        }

        public static Context ctx;
        public static Vibrator myVib;
        public static NotificationCompat.Builder nb;
        public static void static_notification(string title, string msg)
        {
            if (title != null && msg != null)
            {
                if (title.Replace(" ", "") != "" && msg.Replace(" ", "") != "")
                {
                    //PowerManager powerManager = (PowerManager)ctx.GetSystemService(Context.PowerService);//naaah
                    //PowerManager.WakeLock wakeLock = powerManager.NewWakeLock(WakeLockFlags.Full | WakeLockFlags.AcquireCausesWakeup | WakeLockFlags.OnAfterRelease, "wakeLock");
                    nb = new NotificationCompat.Builder(ctx)
                    .SetContentTitle(title)
                    .SetContentText(msg)
                    .SetSmallIcon(Resource.Drawable.icon)
                    .SetDefaults(1)
                    .SetCategory(Notification.CategoryCall)
                    .SetVibrate(new long[] { 0, 1000, 500, 1000, 500, 1000, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200 })
                    .SetAutoCancel(true)
                    .SetWhen(Java.Lang.JavaSystem.CurrentTimeMillis())
                    .SetPriority(2);
                    if ((int)Android.OS.Build.VERSION.SdkInt >= 21) { nb.SetVisibility(1); }//NotificationVisibility.Public
                    Notification notification = nb.Build();
                    NotificationManager NM = (NotificationManager)ctx.GetSystemService(Context.NotificationService);
                    NM.Notify(0, notification);
                    //wakeLock.Release();
                    //myVib.Vibrate(3000);
                }
            }
        }
    }
}