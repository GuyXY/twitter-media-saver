var Downloader = {
  DOWNLOAD_BUTTON_URL: chrome.extension.getURL('images/download-grey-64778D.svg'),
  DOWNLOAD_BUTTON_HOVER_URL: chrome.extension.getURL('images/download-blue-00A2EC.svg'),
  DOWNLOADER_CLASS: "has-downloader-button",

  init: function() {
    setInterval(function() {
      Downloader.injectButtons();
    }, 2000);
  },

  getSingleImageLink: function(singlePhoto) {
    return singlePhoto.find('img').prop('src');
  },

  getSingleVideoLink: function(singleVideo) {
    var videoItem = singleVideo.find('source');
    if (videoItem.length === 0) {
      videoItem = singleVideo.find('video');
    }
    return videoItem.prop('src');
  },

  markItemAsProcessed: function(parentItem) {
    parentItem.addClass(Downloader.DOWNLOADER_CLASS);
  },

  trimLarge: function(link) {
    var LARGE_POSTFIX = ':large';
    if (!link.includes(LARGE_POSTFIX)) {
      return link;
    }
    return link.substring(0, link.indexOf(':large'));
  },

  addDownloadButton: function(idx, parentTweet) {
    parentTweet = $(parentTweet);
    var callback = function() {
      var singlePhoto = parentTweet.find('.AdaptiveMedia-singlePhoto');
      var singleVideo = parentTweet.find('.AdaptiveMedia-video');
      if (singlePhoto.length === 1) {
        link = Downloader.getSingleImageLink(singlePhoto);
        console.log('Found a single photo at link ' + link);
      } else if (singleVideo.length === 1) {
        link = Downloader.getSingleVideoLink(singleVideo);
        console.log('Found a single video at link ' + link);
      } else {
        link = $('.Gallery-media').find('img').prop('src');
        console.log('Found a zoomed in photo at link ' + link);
      }
      if (link !== undefined) {
        link = Downloader.trimLarge(link);
        console.log('Opening a new tab with link ' + link);
        window.open(link);
      }
    };
    var actionBar = parentTweet.find(
      '.ProfileTweet-actionList'
    );
    var button = Downloader.buildDynamicDowloadButton(callback);
    Downloader.addButtonToActionBar(button, actionBar);
    Downloader.markItemAsProcessed(parentTweet);
  },

  addButtonToActionBar: function(button, actionBar) {
    var moreButton = actionBar.find('div.ProfileTweet-action--more');
    if (moreButton.length) {
      console.log('Inserting into zoomed action bar');
      moreButton.before(button);
    } else {
      console.log('Inserting into normal action bar');
      actionBar.append(button);
    }
  },

  nestElements: function(elements) {
    var current = null;
    elements.reverse().forEach((e) => {
      e.append(current);
      current = e;
    });
    return current;
  },

  buildDynamicDowloadButton: function(callback) {
    var parentDiv = $('<div/>', {
      'class': 'ProfileTweet-action ProfileTweet-action--download-media',
    });
    var button = $('<button/>', {
      'class': 'ProfileTweet-actionButton js-actionButton',
    });
    button.click(callback);
    var iconDiv = $('<div/>', {
      'class': 'IconContainer js-tooltip',
    });
    var icon = $('<i/>', {
      'class': 'fas fa-arrow-down',
    });
    return Downloader.nestElements([parentDiv, button, iconDiv, icon]);
  },

  injectButtons: function() {
    var parentsToUpdate = $('div.tweet.has-cards').not('.' + Downloader.DOWNLOADER_CLASS);
    parentsToUpdate.each(Downloader.addDownloadButton);
  }
};

Downloader.init();
