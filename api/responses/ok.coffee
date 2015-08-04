###*
200 (OK) Response

Usage:
return res.ok();
return res.ok(data);
return res.ok(data, 'auth/login');

@param  {Object} data
@param  {String|Object} options
- pass string to render specified view
###
module.exports = sendOK = (data, options) ->
  
  # Get access to `req`, `res`, & `sails`
  req = @req
  res = @res
  sails = req._sails
  sails.log.silly "res.ok() :: Sending 200 (\"OK\") response"
  
  # Set status code
  res.status 200
  
  # If appropriate, serve data as JSON(P)
  return res.jsonx(data)  if req.wantsJSON
  
  # If second argument is a string, we take that to mean it refers to a view.
  # If it was omitted, use an empty object (`{}`)
  options = (if (typeof options is "string") then view: options else options or {})
  
  # If a view was provided in options, serve it.
  # Otherwise try to guess an appropriate view, or if that doesn't
  # work, just send JSON.
  if options.view
    res.view options.view,
      data: data

  
  # If no second argument provided, try to serve the implied view,
  # but fall back to sending JSON(P) if no view can be inferred.
  else
    res.guessView
      data: data
    , couldNotGuessView = ->
      res.jsonx data

