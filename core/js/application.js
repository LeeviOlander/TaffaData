class Application
{
	constructor()
	{
		this.pages = [];
		this.vueRoutes = [];
		this.navigationDropDowns = [];

		this.vueApp = null;
		this.vueRouter = null;
		this.loadingScreen = null;

		this.vueViewElement = null;
		this.contentElement = null;
		this.navigationElement = null;
	}

	initializeVue(vueViewElement)
	{
		// Initialize Vue routing. 
		// Highly Vue specific code, that just does what it needs to do.

		this.vueViewElement = vueViewElement;
		this.vueRouter = new VueRouter(
		{
			routes: this.vueRoutes,
			scrollBehavior(to, from, savedPosition)
			{
				return { x: 0, y: 0 }
			}
		});

		this.vueRouter.afterEach((to, from) =>
		{
			if (to.path != from.path)
			{
				window.onhashchange = null;
			}
			this.routeChanged();
		});

		this.vueApp = new Vue({ router: this.vueRouter }).$mount('#' + this.vueViewElement.id);
	}

	initializeContent(contentElement)
	{
		this.contentElement = contentElement;
	}

	initializeNavigation(navigationElement)
	{
		// Generate the top navigation.
		// This is not a particularly good way to generate a navigation bar,
		// but for simplifying the API for those who have limited web
		// development experience, this works just fine.

		this.navigationElement = navigationElement;

		var c = this.pages.length;
		for (var i = 0; i < c; i++)
		{
			var page = this.pages[i];

			if (page.isDropDown)
			{
				var dropDownElement = document.createElement('div');

				dropDownElement.id = page.id;
				dropDownElement.classList.add(Css.navItemClassName, Css.dropDownClassName);

				var anchor = document.createElement('a');
				anchor.innerHTML = page.name;
				anchor.classList.add(Css.navLinkClassName, Css.dropDownToggleClassName);
				anchor.setAttribute('role', 'button');
				anchor.setAttribute('data-toggle', 'dropdown');
				anchor.setAttribute('aria-haspopup', 'true');
				anchor.setAttribute('aria-expanded', 'false');

				var dropDownMenuElement = document.createElement('div');
				dropDownMenuElement.classList.add(Css.dropDownMenuClassName);

				dropDownElement.appendChild(anchor);
				dropDownElement.appendChild(dropDownMenuElement);

				navigationElement.appendChild(dropDownElement);
			}
			else
			{
				var anchor = document.createElement('a');

				anchor.id = page.id;
				anchor.href = page.href;
				anchor.innerHTML = page.name;
				anchor.onclick = this.navigationLinkClicked;

				anchor.classList.add(Css.navItemClassName, Css.navLinkClassName);

				if (page.dropDownParent == null)
				{
					navigationElement.appendChild(anchor);
				}
				else
				{
					var dropDownMenu = document.getElementById(page.dropDownParent.id).getElementsByClassName(Css.dropDownMenuClassName)[0];
					dropDownMenu.appendChild(anchor);
				}
			}
			
		}

		this.routeChanged();
	}

	initializeLoadingScreen(loadingElement, loadingProgressBarProgressElement, loadingOutputElement)
	{
		this.loadingScreen = new LoadingScreen(loadingElement, loadingProgressBarProgressElement, loadingOutputElement);
	}

	routeChanged()
	{
        // Change the visual state of the drop down under 
        // which the current page is found.

        // Get the part of the url between the # and ?
		var routeUrl = window.location.href.split('#')[1];

		if (routeUrl == null)
		{
			routeUrl = '/';
		}

		routeUrl = routeUrl.split('?')[0];

		var c = this.navigationElement.children.length;

		for (var i = 0; i < c; i++)
		{
			var el = this.navigationElement.children[i];

			if (routeUrl == el.id)
			{
				el.classList.add(Css.navActiveClassName);
				continue;
			}
			else
			{
				el.classList.remove(Css.navActiveClassName);
			}

			if (routeUrl.startsWith(el.id))
			{
				el.classList.add(Css.dropDownActiveClassName);
			}
			else
			{
				el.classList.remove(Css.dropDownActiveClassName);
			}
		}

		this.overrideLoadingScreen();
	}

	navigationLinkClicked()
	{
		if ($('.navbar-toggler').css('display') != 'none')
		{
			$('.navbar-toggler').click();
		}
	}

	overrideLoadingScreen()
	{
		this.loadingScreen.hideLoadingScreen();
		this.loadingScreen.showLoadingScreen();
	}

	isMobile()
	{
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
		{
			return true;
		}

		return false;
	}

	addPage(name, routePath, pathToJsFile, dropDownParent = null, pageHidden = false)
	{
		// Vue needs the hashtag for the url. The hashtag has been left out from
		// the input, since generally file paths do not contain hashtags. This makes
		// the input logic easier to understand for someone not specialized in SPA
		// developing.
		var routeUrl = '#' + routePath;

		var page = { name: name, href: routeUrl, id: routePath, dropDownParent: dropDownParent, isDropDown: false };

		if (!pageHidden)
		{
			this.pages.push(page);
		}

		// XMLHttpRequests do not work for local files on a browser (at least on Chrome), which is why
		// JavaScript files have to be loaded via <sript> tags. Thank you Chrome!
		var scriptElement = document.createElement('script');
		scriptElement.src = pathToJsFile;

		var vueComponent = { template: scriptElement.outerHTML };

		var vueRoute = { path: routePath, component: vueComponent };

		this.vueRoutes.push(vueRoute);
	}

	addDropDown(name, path)
	{
		var page = { name: name, href: '', id: path, dropDownParent: null, isDropDown: true };

		this.pages.push(page);

		return page;
	}

	setContent(htmlContent, hideLoadingScreen = true)
	{
		if (hideLoadingScreen)
		{
			this.loadingScreen.hideLoadingScreen();
		}

		this.contentElement.innerHTML = htmlContent;
	}

	setContentElement(htmlContentElement, hideLoadingScreen = true)
	{
		if (hideLoadingScreen)
		{
			this.loadingScreen.hideLoadingScreen();
		}

		this.contentElement.innerHTML = "";
		this.contentElement.appendChild(htmlContentElement);
	}

	
}
