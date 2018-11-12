// Copyright (c) 2018, vinhbk2000 and contributors
// For license information, please see license.txt


function funcApplySetting(res){
	var setting = {
		navbar_background: "#3c8dbc",
		sidebar_header_background: "#367fa9",
		sidebar_background: "#222d32",
		menu_header_background: "#1a2226",
		navbar_forecolor: "#fff",
		menu_forecolor: "#b8c7ce",
		menu_hover_forecolor: "#fff",
		menu_header_forecolor: "#4b646f",
		logo_expand: "/assets/bdtheme/images/logo_bdoop.png",
		logo_collapse: "/assets/bdtheme/images/bp-ico-32.png",
		fixed_navbar: "1",
		sidebar_toggle: "1",
		hide_left_menu: "0",
		// initial_state: "Collapse"
	}

	Object.keys(res).forEach(el => {
		if(el in setting && res[el]!="" && res[el]!=null)
			setting[el] = res[el];
	});

	setting.navbar_hover_background = increase_brightness(setting.navbar_background, 20);
	setting.sidebar_hover_background = increase_brightness(setting.sidebar_background, -20);

	console.log("Refresh sidebar Setting", setting);

	// Sidebar Initial State
	$("body").removeClass("sidebar-expand").removeClass("sidebar-collapse");
	// if(setting.initial_state=="Collapse")
	// 	$("body").addClass("sidebar-collapse")
	// else
	// 	$("body").addClass("sidebar-expand")
	
	// Tampilkan jika sudah semua
	$(".main-header").show();
	$(".main-sidebar").show();

	//CSS Hacks
	$(".container > .navbar-header").css("margin-left","10px");
	$(".main-section").css('background-color', setting.sidebar_background);
	$(".skin-blue .main-header .navbar").css('background-color', setting.navbar_background);
	$(".skin-blue .main-header .logo").css('background-color', setting.sidebar_header_background);
	$(".main-header .logo .logo-lg").css('background-color', setting.sidebar_header_background);
	$(".main-header .logo .logo-mini").css('background-color', setting.sidebar_header_background);
	$("body > div.main-section > aside").css('background-color', setting.sidebar_background);
	$(".skin-blue .main-sidebar .sidebar-menu > li.header")
		.css('background-color', setting.menu_header_background)
		.css('color', setting.menu_header_forecolor);
	$(".skin-blue .sidebar a").css('color', setting.menu_forecolor);
	$(".skin-blue .main-sidebar .sidebar-menu > li > .treeview-menu")
		.css('background-color', setting.sidebar_background);
	$(".main-header .navbar-brand").css('color', setting.navbar_forecolor);
	$(".skin-blue .main-header .navbar .sidebar-toggle").css('color', setting.navbar_forecolor);
	$(".main-header .logo .logo-lg").css("background-image","url('" + setting.logo_expand + "')");
	$(".main-header .logo .logo-mini").css("background-image","url('" + setting.logo_collapse + "')");
	setInterval(()=>{
		$(".skin-blue .main-header .navbar .nav > li > a").css('color', setting.navbar_forecolor);
	},500);

	// hover hack
	$(".skin-blue .main-header .navbar .sidebar-toggle").mouseover(function(){
		$(this).css('background-color', setting.navbar_hover_background);
	}).mouseout(function() {
		$(this).css('background-color', setting.navbar_background);
	});
	$(".skin-blue .main-sidebar .sidebar-menu > li").mouseover(function(){
		$(this).children("a")
			.css('background-color', setting.sidebar_hover_background)
			.css('color', setting.menu_hover_forecolor)
			.css('border-left-color', setting.navbar_background);
	}).mouseout(function() {
		$(this).children("a")
			.css('background-color', setting.sidebar_background)
			.css('color', setting.menu_forecolor)
			.css('border-left-color', 'transparent');
	});

	// Sidebar toggle
	if(setting.sidebar_toggle == "0"){
		$(".sidebar-toggle").hide();
	}else{
		$(".sidebar-toggle").show();
	}

	// Fixed Navbar
	if(setting.fixed_navbar == "1"){
		$(".main-header").css("position","fixed").css("width","100%");
		$("#body_div").css('padding-top', $(".main-header").css('height'));
	}else{
		$(".main-header").css("position","relative");
		$("#body_div").css('padding-top', '0px');
	}

	// Hide left menu
	if(setting.hide_left_menu == "1"){
		$("body").addClass("hide-left-menu");
	}else{
		$("body").removeClass("hide-left-menu");
	}

	
}

frappe.ui.form.on('Theme Setting', {
	refresh: function(frm) {
		funcApplySetting(frm.doc)
	}
});