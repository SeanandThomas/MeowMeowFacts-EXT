var init = [];
var show_iframes = false;

var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-114054743-1"]);
_gaq.push(["_trackPageview"]);

(function() {
  var ga = document.createElement("script");
  ga.type = "text/javascript";
  ga.async = true;
  ga.src = "https://ssl.google-analytics.com/ga.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(ga, s);
})();

//_gaq.push(["_trackEvent", "new_fact", "true"]);

var background_colors = ["#E24223", "#2B2B77", "#D3B298"];
var kitty, bgc;
bgc = background_colors[
  Math.floor(Math.random() * background_colors.length)
].substring(1);

$(document).ready(function() {
  $(`body`).css(`background-color`, `#${bgc}`);

  $(`button`).click(function() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(`#copylink`).text()).select();
    document.execCommand("copy");
    $temp.remove();
    $(`#copy_clip_text`).addClass(`load`);
    setTimeout(function() {
      $(`#copy_clip_text`).removeClass(`load`);
    }, 1200);
  });

  /*   $(`#facebook_share`).click(function() {
    _gaq.push(["_trackEvent", "facebook_share", "true"]);
  });
  $(`#twitter_share`).click(function() {
    _gaq.push(["_trackEvent", "twitter_share", "true"]);
  });
  $(`button`).click(function() {
    _gaq.push(["_trackEvent", "link_share", "true"]);
  }); */

  /*   $(`.close`).click(function () {
    $(`.iframe_goodies`).removeClass(`load`);
    $(`.close`).removeClass(`load`);
  }); */
});

chrome.storage.sync.get(
  {
    seen_cat_facts: init,
    ga_install_event: init
  },
  function(data) {
    // We are getting the array IDs of cat_facts_seen, if they exist
    var seen_cat_facts = data.seen_cat_facts;
    var ga_install_event = data.ga_install_event;
    console.log(ga_install_event);

    if (ga_install_event.length === 0) {
      console.log(`this is inside`);
      //_gaq.push(["_trackEvent", "extension_installed", "true"]);
      seen_cat_facts = init; // also reset the cat facts, this takes care of legacy people
    } else {
      console.log(`already logged ga event`);
    }

    // console.log(`You've seen ${seen_cat_facts.length} cat facts`);

    // Show the contest every 3 cat facts
    /* if (seen_cat_facts.length % 3 === 0) {
    // similar behavior as an HTTP redirect
    $(`.iframe_goodies`).html(`<iframe src="http://vyper.io/c/3456xxdya" style="width:100%; height:100%;" frameborder="0">
    </iframe>`);
    setTimeout(function () {
      $(`.iframe_goodies`).addClass(`load`);
      $(`.close`).addClass(`load`);
    }, 2000);
  } */

    // Grab the JSON file of all the cat facts
    $.getJSON(`cat_facts.json`, function(all_cat_facts) {
      var unseen_cat_facts = [];

      // Filter out the cat_facts_seen from all_cat_facts UNLESS no more cat facts are left, then restart
      // ALSO, if there are more seen cat facts, then reset
      if (seen_cat_facts.length >= all_cat_facts.length) {
        unseen_cat_facts = all_cat_facts;
        seen_cat_facts = init;
        //_gaq.push(["_trackEvent", "user_cycle_complete", "true"]);
      } else {
        all_cat_facts.forEach(function(e) {
          if (!seen_cat_facts.some(s => s.id == e.id)) {
            unseen_cat_facts.push(e);
          }
        });
      }

      // Choose a random cat fact from all the unseen_cat_facts
      var new_cat_fact =
        unseen_cat_facts[Math.floor(Math.random() * unseen_cat_facts.length)];
      if (new_cat_fact.kitty) {
        kitty = new_cat_fact.kitty;
      } else {
        kitty = Math.floor(Math.random() * 20);
      }

      $(`.kitty img`).attr(`src`, `/cats/cat${kitty}.png`);
      $(`#cat_fact`)
        .text(new_cat_fact.fact)
        .addClass(`load`);
      $(`.kitty`).addClass(`load`);
      $(`#facebook_share`).attr(
        "href",
        `https://www.facebook.com/sharer/sharer.php?u=http%3A//www.meowmeowfacts.com/cat_fact/${
          new_cat_fact.id
        }?k=${kitty}%26bgc=${bgc}`
      );
      $(`#twitter_share`).attr(
        "href",
        `https://twitter.com/home?status=http%3A//www.meowmeowfacts.com/cat_fact/${
          new_cat_fact.id
        }?k=${kitty}%26bgc=${bgc}`
      );
      $(`#copylink`).text(
        `http://www.meowmeowfacts.com/cat_fact/${
          new_cat_fact.id
        }?k=${kitty}&bgc=${bgc}`
      );

      seen_cat_facts.push({
        id: new_cat_fact.id
      });

      // add the new_cat_fact to the array of seen_cat_facts
      chrome.storage.sync.set(
        {
          seen_cat_facts: seen_cat_facts,
          ga_install_event: true
        },
        function() {
          // console.log('Successfully added the new_cat_fact');
        }
      );
    });
  }
);
