using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace karaoke_dl
{
    class Program
    {
        private const string baseUrl = "https://www.karaoke-version.com/";
        private const string loginUrl = "my/login.html";
        private const string myFilesUrl = "my/download.html";

        private const string username = "cullumsri@sky.com";
        private const string password = "Mapex24";

        private const string GetMixJs = "mixer.getMix();return false;";

        private static IWebDriver _driver;
        static void Main(string[] args)
        {
            _driver = new ChromeDriver(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));

            Login();
            
            GoToSong("custombackingtrack/years-and-years/king.html");

            var tracks = FindTracks();

            DownloadTracks(tracks);
        }

        private static string[] FindTracks()
        {
            var tracks = _driver.FindElements(By.CssSelector(".mixer__inner > .track"));

            Console.WriteLine($"{tracks.Count} tracks found...");

            var trackList = new List<string>();

            for (int i = 0; i < tracks.Count; i++)
            {
                var selector = $".mixer__inner > .track[data-index=\"{i}\"]";
                trackList.Add(selector);
                var track = _driver.FindElement(By.CssSelector(selector));
                var caption = track.FindElement(By.CssSelector(".track__caption"));
                Console.WriteLine($"Found {caption.Text}");
            }

            return trackList.ToArray();
        }

        static void Login()
        {
            _driver.Navigate().GoToUrl($"{baseUrl}{loginUrl}");
            _driver.FindElement(By.Id("i_login")).SendKeys(username);
            _driver.FindElement(By.Id("frm_password")).SendKeys(password);
            _driver.FindElement(By.CssSelector(".login__form .btn")).Click();
        }

        static void GoToSong(string songUrl)
        {
            _driver.Navigate().GoToUrl($"{baseUrl}{songUrl}");
        }

        static void DownloadTracks(string[] tracks)
        {
            for (int i = 0; i < tracks.Length; i++)
            {
                Thread.Sleep(2000);
                Console.Write($"Downloading {i+1} of {tracks.Length}");

                var track = _driver.FindElement(By.CssSelector(tracks[i]), 10);
                var caption = track.FindElement(By.CssSelector(".track__caption"));

                Console.Write($"Downloading {caption.Text}... ");

                _driver.FindElement(By.CssSelector($"{tracks[i]} .track__solo"), 10).Click();
                Thread.Sleep(5000);

                _driver.FindElement(By.CssSelector(".download"), 10).Click();

                _driver.FindElement(By.CssSelector(".begin-download"), 30);

                var confirmedBtn = _driver.FindElement(By.CssSelector(".js-modal-close.modal__close"), 30);
                //_driver.Manage().Timeouts().
                confirmedBtn.Click();   

                Console.WriteLine($"OK");
                //return;
            }

            Console.WriteLine("Finished!");
            Console.WriteLine();
        }
    }



    public static class WebDriverExtensions
    {
        public static IWebElement FindElement(this IWebDriver driver, By by, int timeoutInSeconds)
        {
            if (timeoutInSeconds > 0)
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutInSeconds));
                wait.Until(ExpectedConditions.ElementToBeClickable(by));
                return wait.Until(drv => drv.FindElement(by));
            }
            return driver.FindElement(by);
        }
    }
}
