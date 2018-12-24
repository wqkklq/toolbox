const currentCache="toolbox-16.7-12241433",
toolbox="/toolbox/"
const toolboxCSS=toolbox+"css/",
toolboxJS=toolbox+"js/"
self.addEventListener("install",e=>{
	e.waitUntil(
		caches.open(currentCache).then(cache=>{
			return cache.addAll([
				toolbox,
				toolbox+"about",
				toolbox+"calculator",
				toolbox+"chatbot",
				toolbox+"cordova.js",
				toolbox+"currency",
				toolbox+"date",
				toolbox+"equation12",
				toolbox+"equation21",
				toolbox+"equation31",
				toolbox+"feedback",
				toolbox+"filetransfer",
				toolbox+"findlinearfunction",
				toolbox+"findquadraticfunction",
				toolbox+"flashcard",
				toolbox+"index",
				toolbox+"manifest.json",
				toolbox+"marquee",
				toolbox+"mole",
				toolbox+"numberbase",
				toolbox+"quadraticfunction",
				toolbox+"randomnumber",
				toolbox+"search",
				toolbox+"settings",
				toolbox+"shorturl",
				toolbox+"statistics",
				toolbox+"texteditor",
				toolbox+"textencoder",
				toolbox+"timer",
				toolbox+"translate",
				toolbox+"wordlist",
				toolboxCSS+"about.css",
				toolboxCSS+"bing.css",
				toolboxCSS+"calculator.css",
				toolboxCSS+"chatbot.css",
				toolboxCSS+"currency.css",
				toolboxCSS+"dark.css",
				toolboxCSS+"date.css",
				toolboxCSS+"filetransfer.css",
				toolboxCSS+"findfunction.css",
				toolboxCSS+"flashcard.css",
				toolboxCSS+"general.css",
				toolboxCSS+"home.css",
				toolboxCSS+"marquee.css",
				toolboxCSS+"mole.css",
				toolboxCSS+"mui.min.css",
				toolboxCSS+"quadraticfunction.css",
				toolboxCSS+"randomnumber.css",
				toolboxCSS+"settings.css",
				toolboxCSS+"shorturl.css",
				toolboxCSS+"statistics.css",
				toolboxCSS+"texteditor.css",
				toolboxCSS+"textencoder.css",
				toolboxCSS+"timer.css",
				toolboxCSS+"translate.css",
				toolboxCSS+"wordlist.css",
				toolboxJS+"about.js",
				toolboxJS+"calculator.js",
				toolboxJS+"chatbot.js",
				toolboxJS+"currency.js",
				toolboxJS+"date.js",
				toolboxJS+"equation12.js",
				toolboxJS+"equation21.js",
				toolboxJS+"equation31.js",
				toolboxJS+"feedback.js",
				toolboxJS+"filetransfer.js",
				toolboxJS+"findlinearfunction.js",
				toolboxJS+"findquadraticfunction.js",
				toolboxJS+"flashcard.js",
				toolboxJS+"general.js",
				toolboxJS+"home.js",
				toolboxJS+"marquee.js",
				toolboxJS+"md5.min.js",
				toolboxJS+"mole.js",
				toolboxJS+"numberbase.js",
				toolboxJS+"quadraticfunction.js",
				toolboxJS+"randomnumber.js",
				toolboxJS+"search.js",
				toolboxJS+"settings.js",
				toolboxJS+"shorturl.js",
				toolboxJS+"statistics.js",
				toolboxJS+"texteditor.js",
				toolboxJS+"textencoder.js",
				toolboxJS+"timer.js",
				toolboxJS+"translate.js",
				toolboxJS+"wordlist.js",
				toolbox+"fonts/mui.ttf"
			])
		})
	)
})
self.addEventListener("fetch",e=>{
	e.respondWith(
		caches.match(e.request).then(response=>{
			if(response){
				return response
			}
			return fetch(e.request)
		})
	)
})
self.addEventListener("activate",e=>{
	e.waitUntil(
		caches.keys().then(cacheNames=>{
			return Promise.all(
				cacheNames.map(cacheName=>{
					if(cacheName!=currentCache){
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
})