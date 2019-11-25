var converter = new showdown.Converter();


var markdown = 
`	
# Documentation

## Client Side Application

### Objectives

1. **Ease of Accessibility**

	The client side application should be runnable from both the web and from local files without any installations nor
	configurations. In other words, a monkey should be able to start the application successfully. This means that XMLHttpRequests 
	can not be relied on and should not be used. An XMLHttpRequest causes CORS errors when ran from a local file at least 
	on Chromium based browsers. The problem could be circumvented by launching Chrome with some command line flags, but in that
	case the application would be too difficult to execute.

	<br>

1. **Self Contained**

	The client side application should be fully self contained. A content delivery network can not be used, since otherwise 
	the application will not work in an offline environment.

	<br>

1. **No Non-Native Programming Languages**

	If a browser can not natively understand it, then it should not be used. This means that for example no SASS, LESS nor
	TypeScript should be used. Use only pure CSS, HTML and JavaScript.

	<br>

1. **Minimal Dependency on Libraries**

	The central parts of the client side application should be understandable to anyone with a basic knowledge of programming.
	Library specific code should be strictly avoided.

	<br>

1. **URL Indepence**

	The application should work regardless of the URL that it is hosted on. The application should work 
	without any extra configurations on, for example, example.com, xmpl.com, random.com/application or abc.co/xyz.

	<br>

1. **Ease of Extendability**

	The client side application should be easily extandable and should not impose any unnecessary constraints on coding style
	for the frontend functionality. If something is valid HTML5, then it is valid for the purposes of this application.

### Implementation
### Structure

## Server Side Design
### Objectives

1. **Minimal Usage of Server Resources**

	The server should be used as little as possible, because the maximum sustainable load and other parameters are unknown.

	<br>

1. **Minimal Database Access**

	The database should be accessed as seldomly as possible, which means no database accesses on each page render. Database
	access is only an overhead, especially since the data that is provided does not usually have to be exactly up to date. For
	example, updating the data with a frequency of a week is probably more than enough. Compare this to updating each second.
	The database should thus be read every once in a while and the data written to flat files. 

	<br>

1. **Minimal Usage of Bandwidth**

	The bandwidth to the server is limited, so best just to minimize it's usage. The flat data files should thus be compressed
	beforehand on the server. Just enabling GZIP on the server is not enough, since GZIP compresses the files at each request
	(depends on the webserver), which contradicts the 1st objective.

	<br>

1. **Minimal Dependency on Libraries**

	The server side application is by no means complex, which means that no libraries 

	<br>

1. **Single Directory Contained**

	The whole server side application and all the data it uses (with the exception of the database) should be completely contained
	within a single directory. Copying and moving the directory should be enough for the application to run without any data loss (as long as
	the webroot of the webserver is updated when necessary). 

	<br>

1. **URL Indepence**

	The application should work regardless of the URL that it is hosted on. The application should work 
	without any extra configurations on, for example, example.com, xmpl.com, random.com/application or abc.co/xyz.

	<br>

### Implementation
### Structure

`;


application.setContent(converter.makeHtml(markdown));