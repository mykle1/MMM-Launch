/* Magic Mirror
 * Module: MMM-Launch
 *
 * By Mykle1
 *
 */

Module.register("MMM-Launch", {

    // Module config defaults.
    defaults: {
        showPix: "Yes",                 // No = no pictures display
	showAgency: "Yes",              // No = Launch Agency not shown
	showDescription: "No",          // Yes for full descriptive text under picture
        useHeader: true,                // false if you don't want a header
        header: "We have liftoff!",     // Any text you want
        maxWidth: "250px",
        rotateInterval: 30 * 1000,      // 30 seconds
        animationSpeed: 3000,           // fade in and out speed
        initialLoadDelay: 5250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-Launch.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        // this.url = "https://launchlibrary.net/1.2/launch?next=60&mode=verbose";
        this.url = "https://ll.thespacedevs.com/2.0.0/launch/upcoming/?format=json&limit=50";

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
            wrapper.innerHTML = "T - Minus 5 seconds and counting";
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



			// spacecraft // mission type // date of launch // launch site
			var spacecraft = document.createElement("div");
			spacecraft.classList.add("xsmall", "bright", "spacecraft");
			spacecraft.innerHTML = Launch.mission.name + " spacecraft for " + Launch.mission.type + " launches " + this.sTrim(Launch.net, 15, ' ', ' ') + " from " + Launch.pad.location.name;
			wrapper.appendChild(spacecraft);


			var showPix = this.config.showPix
			// picture of rocket type
			var img = document.createElement("img");
			img.classList.add("photo");
		// 	// change placeholder image
		// if (Launch.rocket.imageURL == "https://s3.amazonaws.com/launchlibrary/RocketImages/placeholder_1920.png") {
		// 	Launch.rocket.imageURL = "https://s3.amazonaws.com/launchlibrary/RocketImages/+Briz-KM_480.jpg";
		// }
		    // config option for pictures
		if (this.config.showPix == "Yes") {
			img.src = Launch.image;
			wrapper.appendChild(img);
		}

			var showDescription = this.config.showDescription
			// description of mission
			var description = document.createElement("div");
			description.classList.add("xsmall", "bright", "description");
			// config option for description
		if (this.config.showDescription == "Yes") {
			description.innerHTML = Launch.mission.description;
			wrapper.appendChild(description);
		}

			var showAgency = this.config.showAgency
			// agencies
			var agencies = document.createElement("div");
			agencies.classList.add("xsmall", "bright", "agencies");
			// config option for Agency
		if (this.config.showAgency == "Yes") {
			agencies.innerHTML = "Agency: " + Launch.launch_service_provider.name;
			wrapper.appendChild(agencies);
			}



      var launchRocket = document.createElement("div");
			launchRocket.classList.add("xsmall", "bright", "launchRocket");
			launchRocket.innerHTML = "Launch Rocket: " + Launch.rocket.configuration.full_name;
			wrapper.appendChild(launchRocket);

      }

      return wrapper;

    },


    processLaunch: function(data) {
        this.today = data.Today;
        this.Launch = data;
     console.log(this.Launch); // checking my data
        this.loaded = true;
    },

	sTrim: function(str, length, delim, appendix) {
        if (str.length <= length) return str;
        var trimmedStr = str.substr(0, length + delim.length);
        var lastDelimIndex = trimmedStr.lastIndexOf(delim);
        if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
        if (trimmedStr) trimmedStr += appendix;
        return trimmedStr;
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
