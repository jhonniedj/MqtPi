using System;
using Android.App;
using Android.Content;
using Android.Media;
using Android.Util;
using Firebase.Messaging;
using MqtPi;
using Android.OS;

namespace MqtPi
{
    [Service]
    [IntentFilter(new[] { "com.google.firebase.MESSAGING_EVENT" })]
    public class MyFirebaseMessagingService : FirebaseMessagingService
    {
        const string TAG = "MyFirebaseMsgService";
        public override void OnMessageReceived(RemoteMessage message)
        {
            string bodystring, titlestring;
            message.Data.TryGetValue("body", out bodystring);
            message.Data.TryGetValue("title", out titlestring);
            if (titlestring != null && bodystring != null)
            {
                if (titlestring.Replace(" ", "") != "" && bodystring.Replace(" ", "") != "")
                {
                    MainActivity.static_notification(titlestring, bodystring);
                }
            }
        }
    }
}