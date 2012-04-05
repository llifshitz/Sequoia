//var myHubModel;
var hubLocaleCookieName = "HUB_LOCALE_COOKIE";
var defaultHubLocaleCookieExpMin = 20160;//2 weeks

// Overall viewmodel for this screen, along with initial state
function HubViewModel() {
    //alert("in new HubViewModel");

    var self = this;
    //localization keys
    self.translatedKey1 = 'msg_hello';
    self.translatedKey2 = 'msg_world';
    self.localizedImage1 = 'img_flag';

    // configure language combo box
    jQuery('#lang').change(function() {
        var selection = jQuery('#lang option:selected').val();
        //alert("selection = " + selection);
        if(selection != 'browser'){setLocaleCookie(selection, defaultHubLocaleCookieExpMin);}
        self.loadBundles1(selection != 'browser' ? selection : null);
        jQuery('#langBrowser').empty();
        if (selection == 'browser') {
            jQuery('#langBrowser').text('(' + jQuery.i18n.browserLang() + ')');
        }
        self.updateLocalizedVariables();
    });

    self.loadBundles1 = function(lang) {
        //alert("loadBundles1 for lang= " + lang.toString());
        jQuery.i18n.properties({
            name:'Messages',
            path:'bundle/',
            mode:'both',
            cache: true,
            language:lang
        });
    }

    self.updateLocalizedVariables = function() {
        //alert("in updateLocalizedVariables");
        this.welcomeMsg1(jQuery.i18n.prop(self.translatedKey1));
        this.welcomeMsg2(jQuery.i18n.prop(self.translatedKey2));
        this.imageFlag1(jQuery.i18n.prop(self.localizedImage1));
        //alert ("in updateLocalizedVariables,this.m_welcome1= " + this.welcomeMsg1);
    }

    //alert ("self.ext1 = "+ jQuery.i18n.prop(self.translatedKey1));
    //HubViewModel vars to be translated
    self.welcomeMsg1 = ko.observable(jQuery.i18n.prop(self.translatedKey1));
    self.welcomeMsg2 = ko.observable(jQuery.i18n.prop(self.translatedKey2));
    self.imageFlag1 = ko.observable(jQuery.i18n.prop(self.localizedImage1));
}

jQuery(document).ready(function() {
    //First try to load by saved user preferences
    var hubLocale = checkLocaleCookie();
    if (hubLocale != null && hubLocale != "") {
        //alert("in (document).ready loading from hublocale cookie= " + hubLocale);
        loadBundles(hubLocale);
    } else {
        //alert("in (document).ready loading from browserLang");
        loadBundles(null);
    }

    //myHubModel = new HubViewModel();
    //ko.applyBindings(myHubModel);
    ko.applyBindings(new HubViewModel());
});

function loadBundles(lang) {
    jQuery.i18n.properties({
        name:'Messages',
        path:'bundle/',
        mode:'both',
        cache: true,
        language:lang
    });
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setLocaleCookie(locale, exmin) {
    //alert ("in setLocaleCookie locale="+locale);
    document.cookie = hubLocaleCookieName + "=" + locale;
    var exdate=new Date();
    exdate.setMinutes(exdate.getMinutes() + exmin);
    document.cookie += ("; expires=" + exdate.toUTCString());
    //alert ("in setLocaleCookie exdate= "+exdate.toUTCString());
}

function checkLocaleCookie() {
    var hubLocale = getCookie(hubLocaleCookieName);
    //alert ("in checkLocaleCookie, hublocale = "+ hubLocale);
    return(hubLocale);
}
