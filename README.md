Texas Tribune Bump Stocks
=========================

 

The interactive is best viewed on Google Chrome currently; portraits will not
appear on Firefox or Safari currently.

Because this interactive is not hosted within the
<https://www.texastribune.org/> but pulls from its APIs (which appear not to be
set up to allow cross origin access), in order to view the app, your browser
will need to be set to allow cross origin requests. Here are some plugins that
allow you to change this setting:

 

Chrome:
<https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en>

Firefox: <https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/>

Safari:

-   Go to “Safari” menu and select “Settings"

-   Go to the “Advanced” tab

-   At the bottom of the window, make sure “Show Develop menu in menu bar” is
    checked

-   Return to “General” tab and close window

-   Go to the newly-appeared “Develop” menu and select “Disable Cross-Origin
    Restrictions"

 

This setting can mess up your experience on other websites, so be sure to turn
it off when you are done.

 

Viewing online
--------------

Once your browser is set up according to the above instructions (Chrome is
best), you can view the site online here:
<https://djgz11eeek4n4.cloudfront.net/>

 

Viewing locally
---------------

### For Mac

Once you have downloaded the files, navigate inside the test-app folder from the
command line and type:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
python -m SimpleHTTPServer
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

and hit enter. You should now be able to see the interactive by going to
<http://localhost:8000/> in your browser.

 

Troubleshooting
---------------

If the interactive isn’t loading fully, make sure you have your plugin installed
for allowing cross-origin requests or the settings altered in Safari as
described above. If you are using the suggested plugins in Chrome or Safari, the
resulting icon on your browser should be green. If it is red, simple click it in
Firefox and it should turn green. In chrome, click the button and toggle the
switch in the menu that appears.

You will need to refresh the page once you have fixed your CORS settings.

 

Demo
----

In case of issues, and to demonstrate a few features you may not stumble upon, I
have made a video demonstrating what the interactive should look like here:
<https://youtu.be/eGd2nTdKQh4>

 

Additional Data
---------------

I tried to find historical NRA grades for elected officials, and although I
found it in two places neither was free. However, I think having these grades
would provide important context for the interactive, as it would be easier to
tell who was really changing their position and who might be more persuadable if
a reader decided to contact one of the officials shown. The chart could have
then been sorted vertically with these grades.

Additionally, although the API has the capacity to include people participating
in events in the “tags,” it seems that usually they are not tagged. Thus, only
one official had an associated event in the interactive although there were
other events with officials that just weren’t tagged. I think more tagging of
individuals in the events data would improve this interactive.

![](https://raw.githubusercontent.com/annalizhaz2/texastribunebumpstocks/master/screenshot.png)
