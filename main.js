var init = [];

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-114054743-1']);
_gaq.push(['_trackPageview']);

(function () {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

var background_colors = ['#E24223', '#2B2B77', '#D3B298'];
var cat_num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

$(document).ready(function () {
  $(`body`).css(`background-color`, `${background_colors[Math.floor(Math.random() * background_colors.length)]}`);
  $(`.kitty img`).attr(`src`, `/cats/cat${cat_num[Math.floor(Math.random() * cat_num.length)]}.png`);
  setTimeout(function () {
    $(`.iframe_goodies`).addClass(`load`);
    $(`.close`).addClass(`load`);
  }, 2000);

  $(`.close`).click(function () {
    $(`.iframe_goodies`).removeClass(`load`);
    $(`.close`).removeClass(`load`);
  });
});

chrome.storage.sync.get({
  seen_cat_facts: init
}, function (data) {
  // We are getting the array IDs of cat_facts_seen, if they exist
  var seen_cat_facts = data.seen_cat_facts;

  console.log(`You've seen ${seen_cat_facts.length} cat facts`);
  if (seen_cat_facts.length === 10) {
    // similar behavior as an HTTP redirect
    console.log('hello');
  }

  // Grab the JSON file of all the cat facts
  $.getJSON(`cat_facts.json`, function (all_cat_facts) {
    var unseen_cat_facts = [];

    // Filter out the cat_facts_seen from all_cat_facts UNLESS no more cat facts are left, then restart
    if (seen_cat_facts.length === all_cat_facts.length) {
      unseen_cat_facts = all_cat_facts;
      seen_cat_facts = init;
    } else {
      all_cat_facts.forEach(function (e) {
        if (!seen_cat_facts.some(s => s.id == e.id)) {
          unseen_cat_facts.push(e);
        }
      });
    }

    // Choose a random cat fact from all the unseen_cat_facts
    var new_cat_fact = unseen_cat_facts[Math.floor(Math.random() * unseen_cat_facts.length)];
    $(`#cat_fact`).text(new_cat_fact.fact).addClass(`load`);
    $(`.kitty`).addClass(`load`);


    seen_cat_facts.push({
      'id': new_cat_fact.id
    });

    // add the new_cat_fact to the array of seen_cat_facts
    chrome.storage.sync.set({
      seen_cat_facts: seen_cat_facts
    }, function () {
      // console.log('Successfully added the new_cat_fact');
    });
  });
});