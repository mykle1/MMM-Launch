/* Magic Mirror
 * Module: MMM-Launch
 *
 * By Mykle1
 *
 */
Module.register("MMM-Launch", {

    // Module config defaults.
    defaults: {
    //    multipleChoice: "Yes", // No = no multiple choice answers appear
        useHeader: true, // false if you don't want a header
        header: "We have liftoff!", // Any text you want
        maxWidth: "250px",
        rotateInterval: 30 * 1000, // 20 secs to think then answer appears for 10 secs
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 25 * 60 * 1000, // API limits 50 questions per call 

    },

    getStyles: function() {
        return ["MMM-Launch.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

            // Set locale.
        this.url = "https://launchlibrary.net/1.1/launch?next=60&mode=verbose";
        this.Launch = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "T - Minus 10 seconds . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var LaunchKeys = Object.keys(this.Launch);
        if (LaunchKeys.length > 0) {
            if (this.activeItem >= LaunchKeys.length) {
                this.activeItem = 0;
            }
            var Launch = this.Launch[LaunchKeys[this.activeItem]];


            var top = document.createElement("div");
            top.classList.add("list-row");


        // picture of rocket type
		var img = document.createElement("img");
		img.classList.add("photo");
		img.src = Launch[0].rocket.imageURL;
		wrapper.appendChild(img);
		
		
		// launch date and time
        var launchDate = document.createElement("div");
        launchDate.classList.add("small", "bright", "launchDate");
        launchDate.innerHTML = "Launching " + Launch[0].net;
        wrapper.appendChild(launchDate);
		
		
		// launch site
        var launchSite = document.createElement("div");
        launchSite.classList.add("small", "bright", "launchSite");
        launchSite.innerHTML = "Launch site " + Launch[0].location.name;
        wrapper.appendChild(launchSite);
		
        }
        return wrapper;
    },


    processLaunch: function(data) {
        this.today = data.Today;
        this.Launch = data;
        console.log(this.Launch); // checking my data
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of Launch fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getLaunch();
        }, this.config.updateInterval);
        this.getLaunch(this.config.initialLoadDelay);
        var self = this;
    },

    getLaunch: function() {
        this.sendSocketNotification('GET_LAUNCH', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "LAUNCH_RESULT") {
            this.processLaunch(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});