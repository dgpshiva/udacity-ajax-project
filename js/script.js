
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + "," + cityStr;
    $greeting.text('So you want to live at ' + address + '?');

    var streetViewRequestUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location="
                                    + address;

    $body.append('<img class="bgimg" src="' + streetViewRequestUrl + '">');


    // load New York Times articles
    var NYTimeUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    NYTimeUrl += '?' + $.param({
                            'api-key': "99e414e53a9b47729c7a3ef95371596a",
                            'q': cityStr
                        });
    $.getJSON( NYTimeUrl, function( data ) {
        $nytHeaderElem.text('New York Times Articles about ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i<articles.length; i++)
        {
            var article = articles[i];
            $nytElem.append('<li class="article">'
                        + '<a href="' + article.web_url + '">' + article.headline.main + '</a>'
                        + '<p>' + article.snippet + '</p>'
                        + '</li>');
        }
      })
      .error(function() {
          $nytHeaderElem.text('New York Times articles could not be loaded');
      });


      // load Wikipedia articles
      var WikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='
                        + cityStr + '&format=json&callback=wikiCallback';
      $.ajax({
        url: WikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function(response)
        {
            var articles = response[1];
            for (var i=0; i<articles.length; i++)
            {
                articleStr = articles[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li class="article">'
                                    + '<a href="' + url + '">' + articleStr + '</a>'
                                    + '</li>');
            };
        }
      });

    return false;
};

$('#form-container').submit(loadData);
