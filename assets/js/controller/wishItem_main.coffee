(($) ->
  console.log("start use jquery")
  resultData = new Bloodhound {
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    # // url points to a json file that contains an array of country names, see
    # // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
    # prefetch: 'https://gist.githubusercontent.com/Keeguon/2310008/raw/865a58f59b9db2157413e7d3d949914dbf5a237d/countries.json'
    remote: {
      url: 'wishItem/suggest?q=%QUERY',
      wildcard: '%QUERY'
    }
  }
   
  # // passing in `null` for the `options` arguments will result in the default
  # // options being used
  $('#searchtitle').typeahead null, {
    name: 'countries',
    source: resultData
  };
)(jQuery)