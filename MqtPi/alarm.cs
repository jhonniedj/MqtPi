using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.Text.Format;
using Android.Util;
using System.Threading;

namespace MqtPi
{
    [Activity(Label = "MqtPi - Alarms", Icon = "@drawable/icon")]
    public class alarm : Activity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.alarm);
            // Create your application here
            alarm_context = this;

            init_buttons();

            mainlayout = FindViewById<LinearLayout>(Resource.Id.linearLayout1);
            Button add_button = new Button(this);
            add_button.Text = "+"; add_button.Gravity = GravityFlags.Center; add_button.SetWidth(px(200));
            add_button.Click += delegate { add_alarm(ai, "10:00", " 11111 "); ai++; };

            RunOnUiThread(() =>
            {
                mainlayout.RemoveAllViews();
                mainlayout.AddView(add_button);
            });
        }

        protected override void OnResume()
        {
            base.OnResume();
            startTime = DateTime.UtcNow;
            MQTT_Receive_Timer = new Timer(HandleTimerCallback, startTime, 0, 100);
        }

        DateTime startTime;
        Timer MQTT_Receive_Timer;
        int timer_i;
        Context alarm_context;
        LinearLayout mainlayout;
        void HandleTimerCallback(object state)
        {
            string alarm_out = MainActivity.alarms;
            MainActivity.alarms = "";
            List<string> alarm_output_splitted = new List<string>();
            if (alarm_out != "")
            {
                if (alarm_out.Contains("|"))
                {
                    alarm_output_splitted = alarm_out.Split('|').ToList();
                }
                else { alarm_output_splitted.Add(alarm_out); }

                MQTT_Receive_Timer.Dispose();
                Console.WriteLine("Disposed timer with " + alarm_out);
                addalarms(alarm_output_splitted);
            }
        }
        void addalarms(List<string> alarm_output_splitted)
        {
            List<string> alarm_decoded = new List<string>();

            Console.WriteLine("starting with: ai=" + ai);

            Console.WriteLine("tick-" + timer_i + " with [" + string.Join(" && ", alarm_output_splitted) + "]");
            timer_i++;
            foreach (string alarm_item in alarm_output_splitted)
            {
                List<string> alarm_decode = new List<string>();
                alarm_decode = alarm_item.TrimStart().TrimEnd().Split(' ').ToList();
                if (alarm_decode.Count() == 5)
                {
                    string ongoing;
                    //30 6 * * 1-5  
                    if (alarm_decode[4] == "1-5")
                    {
                        ongoing = ai.ToString() + "$";
                        ongoing += alarm_decode[1] + ":" + alarm_decode[0] + "$";
                        ongoing += " 11111 ";
                        alarm_decoded.Add(ongoing);
                        ai++;
                    }
                    else if (alarm_decode[4] == "0-6")
                    {
                        ongoing = ai.ToString() + "$";
                        ongoing += alarm_decode[1] + ":" + alarm_decode[0] + "$";
                        ongoing += "1111111";
                        alarm_decoded.Add(ongoing);
                        ai++;
                    }
                    else
                    {
                        string bld = "";
                        if (alarm_decode[4].Contains("0")) { bld += "1"; } else { bld += " "; }
                        if (alarm_decode[4].Contains("1")) { bld += "1"; } else { bld += " "; }
                        if (alarm_decode[4].Contains("2")) { bld += "1"; } else { bld += " "; }
                        if (alarm_decode[4].Contains("3")) { bld += "1"; } else { bld += " "; }
                        if (alarm_decode[4].Contains("4")) { bld += "1"; } else { bld += " "; }
                        if (alarm_decode[4].Contains("5")) { bld += "1"; } else { bld += " "; }
                        if (alarm_decode[4].Contains("6")) { bld += "1"; } else { bld += " "; }

                        ongoing = ai.ToString() + "$";
                        ongoing += alarm_decode[1] + ":" + alarm_decode[0] + "$";
                        ongoing += bld;
                        alarm_decoded.Add(ongoing);
                        ai++;
                    }
                }
            }
            foreach (string tmp in alarm_decoded)
            {
                string[] tmparray = tmp.Split('$');
                RunOnUiThread(() => { add_alarm(int.Parse(tmparray[0]), tmparray[1], tmparray[2]); });
            }
            Console.WriteLine("ai=" + ai + " alarm_decoded:" + string.Join("~", alarm_decoded));
            //Console.WriteLine("ending with: ai=" + ai);
        }


        int ai = 1;
        void init_buttons()
        {
            //var backButton = FindViewById<Button>(Resource.Id.backButton);
            //backButton.Click += delegate { Finish(); };
            var forwardButton = FindViewById<Button>(Resource.Id.forwardButton);
            forwardButton.Click += delegate { Finish(); };

            mainlayout = FindViewById<LinearLayout>(Resource.Id.linearLayout1);


            //Button send_button = new Button(this);
            TextView alltext_view = new TextView(this);
            List<string> alltext = new List<string>();
            //alltext = "";
            //send_button.Text = "send";
            var saveButton = FindViewById<Button>(Resource.Id.saveButton);
            saveButton.Click += delegate
            {
                alltext.Clear();
                for (int i = 0; i < mainlayout.ChildCount; i++)
                {
                    var childView = mainlayout.GetChildAt(i);
                    if (childView is LinearLayout)
                    {
                        var childViewcast = (LinearLayout)childView;
                        for (int ii = 0; ii < childViewcast.ChildCount; ii++)
                        {
                            var childView_sub = childViewcast.GetChildAt(ii);
                            if (childView_sub is TextView)
                            {
                                TextView text_child = (TextView)childView_sub;
                                if (text_child.Text.Contains("*")) { alltext.Add(text_child.Text); }
                            }
                        }

                    }
                }

                //alltext_view.Text = string.Join("|", alltext);
                MainActivity.Publish_static(string.Join("|", alltext), "gpio/alarm/time_set");
                Finish();

                //mainlayout.RemoveView(alltext_view);
                //mainlayout.AddView(alltext_view);
            };

            //mainlayout.AddView(send_button);
        }
        int px(int dp)
        {
            var px = (int)((dp) * alarm_context.Resources.DisplayMetrics.Density);
            return px;
        }

        void add_alarm(int alarm_number, string init_time, string init_days)
        {
            string nr = alarm_number.ToString();
            string time_holder = init_time;

            var col_a = new LinearLayout(alarm_context);
            col_a.Orientation = Orientation.Horizontal;

            var col_b = new LinearLayout(alarm_context);
            col_b.Orientation = Orientation.Horizontal;

            TextView inputfield = new TextView(alarm_context);

            int day_width = 30;
            int day_height = 80;
            int padding_left = -26;
            int padding_bottom = 50;

            int row_width = 80;
            TextView alarm_label = new TextView(alarm_context);
            alarm_label.Text = "Alarm " + nr;
            alarm_label.SetWidth(px(row_width));
            alarm_label.SetPadding(px(20), 0, 0, 0);

            CheckBox ma_knopje = new CheckBox(alarm_context);
            CheckBox di_knopje = new CheckBox(alarm_context);
            CheckBox wo_knopje = new CheckBox(alarm_context);
            CheckBox do_knopje = new CheckBox(alarm_context);
            CheckBox vr_knopje = new CheckBox(alarm_context);
            CheckBox za_knopje = new CheckBox(alarm_context);
            CheckBox zo_knopje = new CheckBox(alarm_context);
            Button change_button = new Button(alarm_context);

            ma_knopje.Text = "ma"; ma_knopje.SetWidth(px(day_width)); ma_knopje.SetHeight(px(day_height)); ma_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            ma_knopje.Click += delegate { add_day_repeat(); };
            di_knopje.Text = "di"; di_knopje.SetWidth(px(day_width)); di_knopje.SetHeight(px(day_height)); di_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            di_knopje.Click += delegate { add_day_repeat(); };
            wo_knopje.Text = "wo"; wo_knopje.SetWidth(px(day_width)); wo_knopje.SetHeight(px(day_height)); wo_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            wo_knopje.Click += delegate { add_day_repeat(); };
            do_knopje.Text = "do"; do_knopje.SetWidth(px(day_width)); do_knopje.SetHeight(px(day_height)); do_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            do_knopje.Click += delegate { add_day_repeat(); };
            vr_knopje.Text = "vr"; vr_knopje.SetWidth(px(day_width)); vr_knopje.SetHeight(px(day_height)); vr_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            vr_knopje.Click += delegate { add_day_repeat(); };
            za_knopje.Text = "za"; za_knopje.SetWidth(px(day_width)); za_knopje.SetHeight(px(day_height)); za_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            za_knopje.Click += delegate { add_day_repeat(); };
            zo_knopje.Text = "zo"; zo_knopje.SetWidth(px(day_width)); zo_knopje.SetHeight(px(day_height)); zo_knopje.SetPadding(px(padding_left), 0, 0, px(padding_bottom));
            zo_knopje.Click += delegate { add_day_repeat(); };

            //RunOnUiThread(() =>
            //{
            if (init_days[0] != ' ') { zo_knopje.Checked = true; }
            if (init_days[1] != ' ') { ma_knopje.Checked = true; }
            if (init_days[2] != ' ') { di_knopje.Checked = true; }
            if (init_days[3] != ' ') { wo_knopje.Checked = true; }
            if (init_days[4] != ' ') { do_knopje.Checked = true; }
            if (init_days[5] != ' ') { vr_knopje.Checked = true; }
            if (init_days[6] != ' ') { za_knopje.Checked = true; }
            //});

            string cron_time = "";
            void add_day_repeat()
            {
                string days = "";
                if (zo_knopje.Checked) { days += "0,"; }
                if (ma_knopje.Checked) { days += "1,"; }
                if (di_knopje.Checked) { days += "2,"; }
                if (wo_knopje.Checked) { days += "3,"; }
                if (do_knopje.Checked) { days += "4,"; }
                if (vr_knopje.Checked) { days += "5,"; }
                if (za_knopje.Checked) { days += "6,"; }
                string tmp_days = ""; int tmp_days_i = 0;
                foreach (char ii in days)
                {
                    if (days.Length - 1 != tmp_days_i) { tmp_days += ii; }
                    else { days = tmp_days; }
                    tmp_days_i++;
                }

                //simplify
                if (days.Contains("0,1,2,3,4,5,6")) { days = days.Replace("0,1,2,3,4,5,6", "0-6"); }
                if (days.Contains("1,2,3,4,5")) { days = days.Replace("1,2,3,4,5", "1-5"); }
                //1 time
                if (days == "")
                {
                    DateTime currentTime = DateTime.Now;
                    if (DateTime.DaysInMonth(currentTime.Year, currentTime.Month) == currentTime.Day) { currentTime = new DateTime(currentTime.Year, currentTime.Month + 1, 1); }
                    else { currentTime = new DateTime(currentTime.Year, currentTime.Month, currentTime.Day + 1); }
                    days = currentTime.Day + " " + currentTime.Month + " *";
                }
                else { days = "* * " + days; }
                if (time_holder.Contains(":"))
                {
                    string[] time_holder_arr = time_holder.Split(':');
                    cron_time = time_holder_arr[1] + " " + time_holder_arr[0] + " " + days;
                }
                else { cron_time = time_holder + " " + days; }
                //RunOnUiThread(() =>
                //{
                inputfield.Text = cron_time;
                change_button.Text = time_holder;
                //});
            }
            int spacer_space_init = 20;
            Space spacer_init = new Space(alarm_context);
            spacer_init.SetMinimumWidth(px(spacer_space_init));

            int spacer_space = 20;
            Space spacer_a = new Space(alarm_context);
            spacer_a.SetMinimumWidth(px(spacer_space));
            Space spacer_b = new Space(alarm_context);
            spacer_b.SetMinimumWidth(px(spacer_space));

            Button delete_button = new Button(alarm_context);
            delete_button.Text = "X";
            delete_button.Click += delegate
            {
                mainlayout.RemoveView(col_a);
                mainlayout.RemoveView(col_b);
            };
            delete_button.SetHeight(px(40));

            LinearLayout.LayoutParams delete_offset = new LinearLayout.LayoutParams(px(50), -2);
            delete_offset.LeftMargin = px(-65);
            delete_offset.TopMargin = px(30);
            delete_button.LayoutParameters = delete_offset;

            LinearLayout.LayoutParams date_offset = new LinearLayout.LayoutParams(-2, px(40)) { TopMargin = px(-20) };
            col_b.LayoutParameters = date_offset;

            //inputfield.Text = time_holder;
            inputfield.SetWidth(px(130));
            inputfield.Gravity = GravityFlags.Center;

            change_button.Text = "edit";
            change_button.Click += delegate
            {
                TimePickerFragment frag = TimePickerFragment.NewInstance(
                delegate (DateTime time) { time_holder = time.ToShortTimeString(); add_day_repeat(); });
                frag.Show(FragmentManager, TimePickerFragment.TAG);
            };

            LinearLayout.LayoutParams change_offset = new LinearLayout.LayoutParams(px(80), -2) { LeftMargin = px(row_width) - px(13) + px(spacer_space_init) };
            change_button.LayoutParameters = change_offset;

            col_a.AddView(spacer_init);
            col_a.AddView(alarm_label);
            col_a.AddView(delete_button);
            col_a.AddView(spacer_a);
            col_a.AddView(ma_knopje);
            col_a.AddView(di_knopje);
            col_a.AddView(wo_knopje);
            col_a.AddView(do_knopje);
            col_a.AddView(vr_knopje);
            col_a.AddView(za_knopje);
            col_a.AddView(zo_knopje);

            col_b.AddView(spacer_b);
            col_b.AddView(change_button);
            col_b.AddView(inputfield);

            //RunOnUiThread(() =>
            //{
            mainlayout.AddView(col_a);
            mainlayout.AddView(col_b);
            //});
            add_day_repeat();
        }
    }
    public class TimePickerFragment : DialogFragment, TimePickerDialog.IOnTimeSetListener
    {
        public static readonly string TAG = "MyTimePickerFragment";
        Action<DateTime> timeSelectedHandler = delegate { };

        public static TimePickerFragment NewInstance(Action<DateTime> onTimeSelected)
        {
            TimePickerFragment frag = new TimePickerFragment();
            frag.timeSelectedHandler = onTimeSelected;
            return frag;
        }

        public override Dialog OnCreateDialog(Bundle savedInstanceState)
        {
            DateTime currentTime = DateTime.Now;
            bool is24HourFormat = DateFormat.Is24HourFormat(Activity);
            TimePickerDialog dialog = new TimePickerDialog
                (Activity, this, currentTime.Hour, currentTime.Minute, is24HourFormat);
            return dialog;
        }

        public void OnTimeSet(TimePicker view, int hourOfDay, int minute)
        {
            DateTime currentTime = DateTime.Now;
            DateTime selectedTime = new DateTime(currentTime.Year, currentTime.Month, currentTime.Day, hourOfDay, minute, 0);
            Log.Debug(TAG, selectedTime.ToLongTimeString());
            timeSelectedHandler(selectedTime);
        }
    }
}
