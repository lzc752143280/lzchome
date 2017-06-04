/*!
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */

(function($){

// When called on a container with a selector, fetches the href with
// ajax into the container or with the data-pjax attribute on the link
// itself.(当使用selector调用容器时，将selector的href显示到容器中或使用selector本身的data-pjax属性。)
//
// Tries to make sure the back button and ctrl+click work the way
// you'd expect.(尝试确保后退按钮和"ctrl+左键"按照您的期望工作。)
//
// Exported as $.fn.pjax(输出为$ .fn.pjax)
//
// Accepts a jQuery ajax options object that may include these
// pjax specific :(接受一个jQuery ajax options对象,可能包含这些pjax的特定选项：)
//
//
// container - String selector for the element where to place the response body.
// (container - 用于放置返回的元素的容器。)
//
// push - Whether to pushState the URL. Defaults to true (of course).
// (push - 是否pushState URL。 默认为true（当然）。)
//
// replace - Want to use replaceState instead? That's cool.
//(替换 - 想使用replaceState代替？ 这很酷。)
//
// For convenience the second parameter can be either the container or
// the options object.(为方便起见，第二个参数可以是容器或者options对象。)
//
// Returns the jQuery object(返回jQuery对象)
function fnPjax(selector, container, options) {
  options = optionsFor(container, options)
  return this.on('click.pjax', selector, function(event) {
    var opts = options
    if (!opts.container) {
      opts = $.extend({}, options)
      opts.container = $(this).attr('data-pjax')
    }
    handleClick(event, opts)
  })
}//绑定点击事件

// Public: pjax on click handler(公有：pjax的点击事件)
//
// Exported as $.pjax.click.(输出为$.pjax.click。)
//
// event   - "click" jQuery.Event(event - “click” jQuery事件)
// options - pjax options(options - pjax的options)
//
// Examples(例子)
//
//   $(document).on('click', 'a', $.pjax.click)
//   // is the same as(是相同的)
//   $(document).pjax('a')
//
// Returns nothing.(没有返回值)
function handleClick(event, container, options) {
  options = optionsFor(container, options)

  var link = event.currentTarget
  var $link = $(link)

  if (link.tagName.toUpperCase() !== 'A')
    throw "$.fn.pjax or $.pjax.click requires an anchor element"

  // Middle click, cmd click, and ctrl click should open
  // links in a new tab as normal.
  if ( event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey )
    return

  // Ignore cross origin links
  if ( location.protocol !== link.protocol || location.hostname !== link.hostname )
    return

  // Ignore case when a hash is being tacked on the current URL
  if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
    return

  // Ignore event with default prevented
  if (event.isDefaultPrevented())
    return

  var defaults = {
    url: link.href,
    container: $link.attr('data-pjax'),
    target: link
  }

  var opts = $.extend({}, defaults, options)
  var clickEvent = $.Event('pjax:click')
  $link.trigger(clickEvent, [opts])

  if (!clickEvent.isDefaultPrevented()) {
    pjax(opts)
    event.preventDefault()
    $link.trigger('pjax:clicked', [opts])
  }
}//处理点击事件

// Public: pjax on form submit handler(公有：pjax的表单提交事件)
//
// Exported as $.pjax.submit(导出为$ .pjax.submit)
//
// event   - "click" jQuery.Event(事件 - “点击”jQuery.Event)
// options - pjax options(选项 - pjax选项)
//
// Examples(例子)
//
//  $(document).on('submit', 'form', function(event) {
//    $.pjax.submit(event, '[data-pjax-container]')
//  })
//
// Returns nothing.(没有返回值)
function handleSubmit(event, container, options) {
  options = optionsFor(container, options)

  var form = event.currentTarget
  var $form = $(form)

  if (form.tagName.toUpperCase() !== 'FORM')
    throw "$.pjax.submit requires a form element"

  var defaults = {
    type: ($form.attr('method') || 'GET').toUpperCase(),
    url: $form.attr('action'),
    container: $form.attr('data-pjax'),
    target: form
  }

  if (defaults.type !== 'GET' && window.FormData !== undefined) {
    defaults.data = new FormData(form)
    defaults.processData = false
    defaults.contentType = false
  } else {
    // Can't handle file uploads, exit
    if ($form.find(':file').length) {
      return
    }

    // Fallback to manually serializing the fields
    defaults.data = $form.serializeArray()
  }

  pjax($.extend({}, defaults, options))

  event.preventDefault()
}//处理表单事件

// Loads a URL with ajax, puts the response body inside a container,
// then pushState()'s the loaded URL.
// (加载一个带ajax的URL，将返回的元素放在一个容器中，然后pushState（）加载的URL。)
//
// Works just like $.ajax in that it accepts a jQuery ajax
// settings object (with keys like url, type, data, etc).
// (它像$ .ajax一样工作，因为它接受一个jQuery ajax设置对象（url，type，data）。)
//
// Accepts these extra keys:(接受这些额外的属性：)
//
// container - String selector for where to stick the response body.
// (container - 用于放置响应体的元素的字符串选择器。)
//
// push - Whether to pushState the URL. Defaults to true (of course).
// (push - 是否pushState URL。 默认为true（当然）。)
//
// replace - Want to use replaceState instead? That's cool.
// (替换 - 想使用replaceState代替？ 这很酷。)
//
// Use it just like $.ajax:(使用它就像$ .ajax：)
//
//   var xhr = $.pjax({ url: this.href, container: '#main' })
//   console.log( xhr.readyState )
//
// Returns whatever $.ajax returns.(返回$ .ajax的返回值。)
function pjax(options) {
  options = $.extend(true, {}, $.ajaxSettings, pjax.defaults, options)

  if ($.isFunction(options.url)) {
    options.url = options.url()
  }

  var hash = parseURL(options.url).hash

  var containerType = $.type(options.container)
  if (containerType !== 'string') {
    throw "expected string value for 'container' option; got " + containerType
  }
  var context = options.context = $(options.container)
  if (!context.length) {
    throw "the container selector '" + options.container + "' did not match anything"
  }

  // We want the browser to maintain two separate internal caches: one
  // for pjax'd partial page loads and one for normal page loads.
  // Without adding this secret parameter, some browsers will often
  // confuse the two.
  if (!options.data) options.data = {}
  if ($.isArray(options.data)) {
    options.data.push({name: '_pjax', value: options.container})
  } else {
    options.data._pjax = options.container
  }

  function fire(type, args, props) {
    if (!props) props = {}
    props.relatedTarget = options.target
    var event = $.Event(type, props)
    context.trigger(event, args)
    return !event.isDefaultPrevented()
  }

  var timeoutTimer

  options.beforeSend = function(xhr, settings) {
    // No timeout for non-GET requests
    // Its not safe to request the resource again with a fallback method.
    if (settings.type !== 'GET') {
      settings.timeout = 0
    }

    xhr.setRequestHeader('X-PJAX', 'true')
    xhr.setRequestHeader('X-PJAX-Container', options.container)

    if (!fire('pjax:beforeSend', [xhr, settings]))
      return false

    if (settings.timeout > 0) {
      timeoutTimer = setTimeout(function() {
        if (fire('pjax:timeout', [xhr, options]))
          xhr.abort('timeout')
      }, settings.timeout)

      // Clear timeout setting so jquerys internal timeout isn't invoked
      settings.timeout = 0
    }

    var url = parseURL(settings.url)
    if (hash) url.hash = hash
    options.requestUrl = stripInternalParams(url)
  }

  options.complete = function(xhr, textStatus) {
    if (timeoutTimer)
      clearTimeout(timeoutTimer)

    fire('pjax:complete', [xhr, textStatus, options])

    fire('pjax:end', [xhr, options])
  }

  options.error = function(xhr, textStatus, errorThrown) {
    var container = extractContainer("", xhr, options)

    var allowed = fire('pjax:error', [xhr, textStatus, errorThrown, options])
    if (options.type == 'GET' && textStatus !== 'abort' && allowed) {
      locationReplace(container.url)
    }
  }

  options.success = function(data, status, xhr) {
    var previousState = pjax.state

    // If $.pjax.defaults.version is a function, invoke it first.
    // Otherwise it can be a static string.
    var currentVersion = typeof $.pjax.defaults.version === 'function' ?
      $.pjax.defaults.version() :
      $.pjax.defaults.version

    var latestVersion = xhr.getResponseHeader('X-PJAX-Version')

    var container = extractContainer(data, xhr, options)

    var url = parseURL(container.url)
    if (hash) {
      url.hash = hash
      container.url = url.href
    }

    // If there is a layout version mismatch, hard load the new url
    if (currentVersion && latestVersion && currentVersion !== latestVersion) {
      locationReplace(container.url)
      return
    }

    // If the new response is missing a body, hard load the page
    if (!container.contents) {
      locationReplace(container.url)
      return
    }

    pjax.state = {
      id: options.id || uniqueId(),
      url: container.url,
      title: container.title,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }

    if (options.push || options.replace) {
      window.history.replaceState(pjax.state, container.title, container.url)
    }

    // Only blur the focus if the focused element is within the container.
    var blurFocus = $.contains(context, document.activeElement)

    // Clear out any focused controls before inserting new page contents.
    if (blurFocus) {
      try {
        document.activeElement.blur()
      } catch (e) { /* ignore */ }
    }

    if (container.title) document.title = container.title

    fire('pjax:beforeReplace', [container.contents, options], {
      state: pjax.state,
      previousState: previousState
    })
    context.html(container.contents)

    // FF bug: Won't autofocus fields that are inserted via JS.
    // This behavior is incorrect. So if theres no current focus, autofocus
    // the last field.
    //
    // http://www.w3.org/html/wg/drafts/html/master/forms.html
    var autofocusEl = context.find('input[autofocus], textarea[autofocus]').last()[0]
    if (autofocusEl && document.activeElement !== autofocusEl) {
      autofocusEl.focus()
    }

    executeScriptTags(container.scripts)

    var scrollTo = options.scrollTo

    // Ensure browser scrolls to the element referenced by the URL anchor
    if (hash) {
      var name = decodeURIComponent(hash.slice(1))
      var target = document.getElementById(name) || document.getElementsByName(name)[0]
      if (target) scrollTo = $(target).offset().top
    }

    if (typeof scrollTo == 'number') $(window).scrollTop(scrollTo)

    fire('pjax:success', [data, status, xhr, options])
  }


  // Initialize pjax.state for the initial page load. Assume we're
  // using the container and options of the link we're loading for the
  // back button to the initial page. This ensures good back button
  // behavior.
  if (!pjax.state) {
    pjax.state = {
      id: uniqueId(),
      url: window.location.href,
      title: document.title,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }
    window.history.replaceState(pjax.state, document.title)
  }

  // Cancel the current request if we're already pjaxing
  abortXHR(pjax.xhr)

  pjax.options = options
  var xhr = pjax.xhr = $.ajax(options)

  if (xhr.readyState > 0) {
    if (options.push && !options.replace) {
      // Cache current container element before replacing it
      cachePush(pjax.state.id, [options.container, cloneContents(context)])

      window.history.pushState(null, "", options.requestUrl)
    }

    fire('pjax:start', [xhr, options])
    fire('pjax:send', [xhr, options])
  }

  return pjax.xhr
}//加载一个带ajax的URL，将返回的元素放在一个容器中，然后pushState（）加载的URL

// Public: Reload current page with pjax.(公有：使用pjax重新加载当前页面。)
//
// Returns whatever $.pjax returns.(返回$ .ajax的返回值。)
function pjaxReload(container, options) {
  var defaults = {
    url: window.location.href,
    push: false,
    replace: true,
    scrollTo: false
  }

  return pjax($.extend(defaults, optionsFor(container, options)))
}//pjax重载

// Internal: Hard replace current state with url.(内部：用url替换当前状态。)
//
// Work for around WebKit(在WebKit上工作)
//   https://bugs.webkit.org/show_bug.cgi?id=93506
//
// Returns nothing.(没有返回值)
function locationReplace(url) {
  window.history.replaceState(null, "", pjax.state.url)
  window.location.replace(url)
}//用url替换当前地址


var initialPop = true
var initialURL = window.location.href
var initialState = window.history.state

// Initialize $.pjax.state if possible(如果可能，请初始化$ .pjax.state)
// Happens when reloading a page and coming forward from a different
// session history.(在重新加载页面并从不同的会话历史发送时发生。)
if (initialState && initialState.container) {
  pjax.state = initialState
}

// Non-webkit browsers don't fire an initial popstate event(非webkit浏览器不会触发初始的popstate事件)
if ('state' in window.history) {
  initialPop = false
}

// popstate handler takes care of the back and forward buttons(popstate处理程序处理后退按钮)
//
// You probably shouldn't use pjax on pages with other pushState
// stuff yet.(你可能不应该在其他pushState的页面上使用pjax。)
function onPjaxPopstate(event) {

  // Hitting back or forward should override any pending PJAX request.
  if (!initialPop) {
    abortXHR(pjax.xhr)
  }

  var previousState = pjax.state
  var state = event.state
  var direction

  if (state && state.container) {
    // When coming forward from a separate history session, will get an
    // initial pop with a state we are already at. Skip reloading the current
    // page.
    if (initialPop && initialURL == state.url) return

    if (previousState) {
      // If popping back to the same state, just skip.
      // Could be clicking back from hashchange rather than a pushState.
      if (previousState.id === state.id) return

      // Since state IDs always increase, we can deduce the navigation direction
      direction = previousState.id < state.id ? 'forward' : 'back'
    }

    var cache = cacheMapping[state.id] || []
    var containerSelector = cache[0] || state.container
    var container = $(containerSelector), contents = cache[1]

    if (container.length) {
      if (previousState) {
        // Cache current container before replacement and inform the
        // cache which direction the history shifted.
        cachePop(direction, previousState.id, [containerSelector, cloneContents(container)])
      }

      var popstateEvent = $.Event('pjax:popstate', {
        state: state,
        direction: direction
      })
      container.trigger(popstateEvent)

      var options = {
        id: state.id,
        url: state.url,
        container: containerSelector,
        push: false,
        fragment: state.fragment,
        timeout: state.timeout,
        scrollTo: false
      }

      if (contents) {
        container.trigger('pjax:start', [null, options])

        pjax.state = state
        if (state.title) document.title = state.title
        var beforeReplaceEvent = $.Event('pjax:beforeReplace', {
          state: state,
          previousState: previousState
        })
        container.trigger(beforeReplaceEvent, [contents, options])
        container.html(contents)

        container.trigger('pjax:end', [null, options])
      } else {
        pjax(options)
      }

      // Force reflow/relayout before the browser tries to restore the
      // scroll position.
      container[0].offsetHeight // eslint-disable-line no-unused-expressions
    } else {
      locationReplace(location.href)
    }
  }
  initialPop = false
}//用popstate事件处理前进后退按钮

// Fallback version of main pjax function for browsers that don't
// support pushState.(主要pjax功能的后备版本不支持pushState的浏览器。)
//
// Returns nothing since it retriggers a hard form submission.(由于它重新触发硬表单提交，所以不会返回。)
function fallbackPjax(options) {
  var url = $.isFunction(options.url) ? options.url() : options.url,
      method = options.type ? options.type.toUpperCase() : 'GET'

  var form = $('<form>', {
    method: method === 'GET' ? 'GET' : 'POST',
    action: url,
    style: 'display:none'
  })

  if (method !== 'GET' && method !== 'POST') {
    form.append($('<input>', {
      type: 'hidden',
      name: '_method',
      value: method.toLowerCase()
    }))
  }

  var data = options.data
  if (typeof data === 'string') {
    $.each(data.split('&'), function(index, value) {
      var pair = value.split('=')
      form.append($('<input>', {type: 'hidden', name: pair[0], value: pair[1]}))
    })
  } else if ($.isArray(data)) {
    $.each(data, function(index, value) {
      form.append($('<input>', {type: 'hidden', name: value.name, value: value.value}))
    })
  } else if (typeof data === 'object') {
    var key
    for (key in data)
      form.append($('<input>', {type: 'hidden', name: key, value: data[key]}))
  }

  $(document.body).append(form)
  form.submit()
}//后退方法

// Internal: Abort an XmlHttpRequest if it hasn't been completed,(内部：如果尚未完成XmlHttpRequest中止，)
// also removing its event handlers.(也删除其事件处理程序。)
function abortXHR(xhr) {
  if ( xhr && xhr.readyState < 4) {
    xhr.onreadystatechange = $.noop
    xhr.abort()
  }
}//舍弃XHR对象

// Internal: Generate unique id for state object.(内部：为状态对象生成唯一的ID。)
//
// Use a timestamp instead of a counter since ids should still be
// unique across page loads.(使用时间戳而不是计数器，因为ids在页面加载中应该仍然是唯一的。)
//
// Returns Number.(返回数字)
function uniqueId() {
  return (new Date).getTime()
}//为状态对象生成唯一的ID

function cloneContents(container) {
  var cloned = container.clone()
  // Unmark script tags as already being eval'd so they can get executed again
  // when restored from cache. HAXX: Uses jQuery internal method.
  cloned.find('script').each(function(){
    if (!this.src) $._data(this, 'globalEval', false)
  })
  return cloned.contents()
}//克隆内容

// Internal: Strip internal query params from parsed URL.(内部：从解析的URL中剥离内部查询参数。)
//
// Returns sanitized url.href String.(返回消毒的url.href字符串。)
function stripInternalParams(url) {
  url.search = url.search.replace(/([?&])(_pjax|_)=[^&]*/g, '').replace(/^&/, '')
  return url.href.replace(/\?($|#)/, '$1')
}//从解析的URL中剥离内部查询参数

// Internal: Parse URL components and returns a Locationish object.(Internal：解析URL组件并返回一个Locationish对象。)
//
// url - String URL(url - 字符串URL)
//
// Returns HTMLAnchorElement that acts like Location.(返回HTMLAnchorElement，类似于Location。)
function parseURL(url) {
  var a = document.createElement('a')
  a.href = url
  return a
}//解析URL组件并返回一个Locationish对象

// Internal: Return the `href` component of given URL object with the hash
// portion removed.(内部：返回给定URL对象的“href”组件，并删除哈希部分。)
//
// location - Location or HTMLAnchorElement(位置 - 位置或HTMLAnchorElement)
//
// Returns String(返回字符串)
function stripHash(location) {
  return location.href.replace(/#.*/, '')
}//返回给定URL对象的“href”组件，并删除哈希部分

// Internal: Build options Object for arguments.(内部：构建选项参数的对象。)
//
// For convenience the first parameter can be either the container or
// the options object.(为方便起见，第一个参数可以是容器或者选项对象。)
//
// Examples(例子)
//
//   optionsFor('#container')
//   // => {container: '#container'}
//
//   optionsFor('#container', {push: true})
//   // => {container: '#container', push: true}
//
//   optionsFor({container: '#container', push: true})
//   // => {container: '#container', push: true}
//
// Returns options Object.(返回选项对象。)
function optionsFor(container, options) {
  if (container && options) {
    options = $.extend({}, options)
    options.container = container
    return options
  } else if ($.isPlainObject(container)) {
    return container
  } else {
    return {container: container}
  }
}//构建选项参数的对象

// Internal: Filter and find all elements matching the selector.(内部：过滤并查找与选择器匹配的所有元素。)
//
// Where $.fn.find only matches descendants, findAll will test all the
// top level elements in the jQuery object as well.(其中$ .fn.find只匹配后代，findAll也将测试jQuery对象中的所有顶级元素。)
//
// elems    - jQuery object of Elements(elems - 元素的jQuery对象)
// selector - String selector to match(selector - 要匹配的字符串选择器)
//
// Returns a jQuery object.(返回一个jQuery对象。)
function findAll(elems, selector) {
  return elems.filter(selector).add(elems.find(selector))
}//过滤并查找与选择器匹配的所有元素

function parseHTML(html) {
  return $.parseHTML(html, document, true)
}//解析HTML

// Internal: Extracts container and metadata from response.(内部：从响应中提取容器和元数据。)
//
// 1. Extracts X-PJAX-URL header if set(1.提取X-PJAX-URL标题如果设置)
// 2. Extracts inline <title> tags(2.提取内联<title>标签)
// 3. Builds response Element and extracts fragment if set(3.构建响应元素并提取片段（如果设置）)
//
// data    - String response data(data - 字符串响应数据)
// xhr     - XHR response(xhr - XHR回应)
// options - pjax options Object(options - pjax选项对象)
//
// Returns an Object with url, title, and contents keys.(返回一个带有url，title和content的对象。)
function extractContainer(data, xhr, options) {
  var obj = {}, fullDocument = /<html/i.test(data)

  // Prefer X-PJAX-URL header if it was set, otherwise fallback to
  // using the original requested url.
  var serverUrl = xhr.getResponseHeader('X-PJAX-URL')
  obj.url = serverUrl ? stripInternalParams(parseURL(serverUrl)) : options.requestUrl

  var $head, $body
  // Attempt to parse response html into elements
  if (fullDocument) {
    $body = $(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
    var head = data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)
    $head = head != null ? $(parseHTML(head[0])) : $body
  } else {
    $head = $body = $(parseHTML(data))
  }

  // If response data is empty, return fast
  if ($body.length === 0)
    return obj

  // If there's a <title> tag in the header, use it as
  // the page's title.
  obj.title = findAll($head, 'title').last().text()

  if (options.fragment) {
    var $fragment = $body
    // If they specified a fragment, look for it in the response
    // and pull it out.
    if (options.fragment !== 'body') {
      $fragment = findAll($fragment, options.fragment).first()
    }

    if ($fragment.length) {
      obj.contents = options.fragment === 'body' ? $fragment : $fragment.contents()

      // If there's no title, look for data-title and title attributes
      // on the fragment
      if (!obj.title)
        obj.title = $fragment.attr('title') || $fragment.data('title')
    }

  } else if (!fullDocument) {
    obj.contents = $body
  }

  // Clean up any <title> tags
  if (obj.contents) {
    // Remove any parent title elements
    obj.contents = obj.contents.not(function() { return $(this).is('title') })

    // Then scrub any titles from their descendants
    obj.contents.find('title').remove()

    // Gather all script[src] elements
    obj.scripts = findAll(obj.contents, 'script[src]').remove()
    obj.contents = obj.contents.not(obj.scripts)
  }

  // Trim any whitespace off the title
  if (obj.title) obj.title = $.trim(obj.title)

  return obj
}//从响应中提取容器和元数据

// Load an execute scripts using standard script request.(使用标准脚本请求加载执行脚本。)
//
// Avoids jQuery's traditional $.getScript which does a XHR request and
// globalEval.(避免jQuery的传统$ .getScript，它执行XHR请求和globalEval。)
//
// scripts - jQuery object of script Elements(scripts - 脚本元素的jQuery对象)
//
// Returns nothing.(没有返回值)
function executeScriptTags(scripts) {
  if (!scripts) return

  var existingScripts = $('script[src]')

  scripts.each(function() {
    var src = this.src
    var matchedScripts = existingScripts.filter(function() {
      return this.src === src
    })
    if (matchedScripts.length) return

    var script = document.createElement('script')
    var type = $(this).attr('type')
    if (type) script.type = type
    script.src = $(this).attr('src')
    document.head.appendChild(script)
  })
}//使用标准脚本请求加载执行脚本

// Internal: History DOM caching class.(内部：历史DOM缓存类。)
var cacheMapping      = {}
var cacheForwardStack = []
var cacheBackStack    = []

// Push previous state id and container contents into the history
// cache. Should be called in conjunction with `pushState` to save the
// previous container contents.
//(将先前的状态id和容器内容推入历史缓存。 应该与`pushState`一起调用以保存以前的容器内容。)
// id    - State ID Number(id - 状态ID号)
// value - DOM Element to cache(value - 要缓存的DOM元素)
//
// Returns nothing.(没有返回值)
function cachePush(id, value) {
  cacheMapping[id] = value
  cacheBackStack.push(id)

  // Remove all entries in forward history stack after pushing a new page.
  trimCacheStack(cacheForwardStack, 0)

  // Trim back history stack to max cache length.
  trimCacheStack(cacheBackStack, pjax.defaults.maxCacheLength)
}

// Shifts cache from directional history cache. Should be
// called on `popstate` with the previous state id and container
// contents.(从定向历史缓存中切换缓存。 应该用`popstate`调用前面的状态id和容器内容。)
//
// direction - "forward" or "back" String(direction - "forward" 或 "back" 字符串)
// id        - State ID Number(id - 状态ID号)
// value     - DOM Element to cache(value - 要缓存的DOM元素)
//
// Returns nothing.(没有返回值)
function cachePop(direction, id, value) {
  var pushStack, popStack
  cacheMapping[id] = value

  if (direction === 'forward') {
    pushStack = cacheBackStack
    popStack  = cacheForwardStack
  } else {
    pushStack = cacheForwardStack
    popStack  = cacheBackStack
  }

  pushStack.push(id)
  id = popStack.pop()
  if (id) delete cacheMapping[id]

  // Trim whichever stack we just pushed to to max cache length.
  trimCacheStack(pushStack, pjax.defaults.maxCacheLength)
}

// Trim a cache stack (either cacheBackStack or cacheForwardStack) to be no
// longer than the specified length, deleting cached DOM elements as necessary.
//(将缓存堆栈（cacheBackStack或cacheForwardStack）修剪为不超过指定的长度，根据需要删除缓存的DOM元素。)
// stack  - Array of state IDs(stack - 状态ID数组)
// length - Maximum length to trim to(length - 要修剪的最大长度)
//
// Returns nothing.(没有返回值)
function trimCacheStack(stack, length) {
  while (stack.length > length)
    delete cacheMapping[stack.shift()]
}

// Public: Find version identifier for the initial page load.(公共：查找初始页面加载的版本标识符。)
//
// Returns String version or undefined.(返回String版本或未定义。)
function findVersion() {
  return $('meta').filter(function() {
    var name = $(this).attr('http-equiv')
    return name && name.toUpperCase() === 'X-PJAX-VERSION'
  }).attr('content')
}//查找初始页面加载的版本标识符

// Install pjax functions on $.pjax to enable pushState behavior.(在$ .pjax上安装pjax函数以启用pushState行为。)
//
// Does nothing if already enabled.(如果已启用，则不起作用)
//
// Examples(例子)
//
//     $.pjax.enable()
//
// Returns nothing.(没有返回值)
function enable() {
  $.fn.pjax = fnPjax
  $.pjax = pjax
  $.pjax.enable = $.noop
  $.pjax.disable = disable
  $.pjax.click = handleClick
  $.pjax.submit = handleSubmit
  $.pjax.reload = pjaxReload
  $.pjax.defaults = {
    timeout: 650,
    push: true,
    replace: false,
    type: 'GET',
    dataType: 'html',
    scrollTo: 0,
    maxCacheLength: 20,
    version: findVersion
  }
  $(window).on('popstate.pjax', onPjaxPopstate)
}//启用pushState行为/参数设置

// Disable pushState behavior.(禁用pushState行为。)
//
// This is the case when a browser doesn't support pushState. It is
// sometimes useful to disable pushState for debugging on a modern
// browser.(这是浏览器不支持pushState的情况。 在现代浏览器上禁用pushState进行调试有时是有用的。)
//
// Examples(例子)
//
//     $.pjax.disable()
//
// Returns nothing.(没有返回值)
function disable() {
  $.fn.pjax = function() { return this }
  $.pjax = fallbackPjax
  $.pjax.enable = enable
  $.pjax.disable = $.noop
  $.pjax.click = $.noop
  $.pjax.submit = $.noop
  $.pjax.reload = function() { window.location.reload() }

  $(window).off('popstate.pjax', onPjaxPopstate)
}//禁用pushState行为


// Add the state property to jQuery's event object so we can use it in(将状态属性添加到jQuery事件对象，以便我们可以使用它)
// $(window).bind('popstate')
if ($.event.props && $.inArray('state', $.event.props) < 0) {
  $.event.props.push('state')
} else if (!('state' in $.Event.prototype)) {
  $.event.addProp('state')
}

// Is pjax supported by this browser?(这个浏览器是否支持pjax？)
$.support.pjax =
  window.history && window.history.pushState && window.history.replaceState &&
  // pushState isn't reliable on iOS until 5.(pushState在iOS上不可靠，直到5。)
  !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

if ($.support.pjax) {
  enable()
} else {
  disable()
}

})(jQuery)
