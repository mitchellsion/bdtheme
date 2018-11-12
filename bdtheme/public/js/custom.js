$(document).ready(function() {
	$('header').prepend(frappe.render_template("logo"));
	$('header .navbar .container').prepend(frappe.render_template("sidebar-toggle"));
    // $('.main-section').append(frappe.render_template("main-sidebar"));
	$('header').addClass('main-header');
	$('header .navbar').removeClass('navbar-fixed-top');
	$('body').addClass('skin-blue sidebar-mini sidebar-collapse');	
    $('#body_div').addClass('content-wrapper');	
    
    // Hide jika belum loading
    setTimeout(() => {
        $(".main-header").hide();
        $(".main-sidebar").hide();
        genereate_side_menu((ret)=>{
            $('.main-section').append(ret);
            sidebar_setting();
        })
    }, 50);
    
	
	bdtheme.set_user_background();
    
});

frappe.provide("bdtheme");

// add toolbar icon
$(document).bind('toolbar_setup', function() {
	frappe.app.name = "bdoop Erp";
	$('.navbar-home').html(frappe._('Home'));
});


// Untuk mengatur tampilan sidebar
function sidebar_setting(){
    frappe.call({
		method:"bdtheme.provider.get_theme_setting",
		callback: function(r) {
            if(r.message){
                funcApplySetting(r.message);
            }
        }
    });

    var funcApplySetting = (res)=>{
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
            initial_state: "Collapse"
        }

        res.forEach(el => {
            if(el.field in setting && el.value!="" && el.value!=null)
                setting[el.field] = el.value;
        });

        setting.navbar_hover_background = increase_brightness(setting.navbar_background, 20);
        setting.sidebar_hover_background = increase_brightness(setting.sidebar_background, -20);

        console.log("Sidebar Setting", setting);

        // Sidebar Initial State
        $("body").removeClass("sidebar-expand").removeClass("sidebar-collapse");
        if(setting.initial_state=="Collapse")
            $("body").addClass("sidebar-collapse")
        else
            $("body").addClass("sidebar-expand")
        
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
    
}


// Tambah brighness dari hex
function increase_brightness(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}


// generate menu dari doctype Sidebar Menu
function genereate_side_menu(callback){
    // Get sidebar header
    var sidebarHeader = [];
    frappe.call({
		method:"frappe.client.get_list",
		args: {
			doctype:"Sidebar Header",
            fields:["*"]
		},
		callback: function(r) {
            if(r.message){
                sidebarHeader = r.message.sort((a,b) => (a.urutan > b.urutan) ? 1 : ((b.urutan > a.urutan) ? -1 : 0));
                console.log("Sidebar Header", sidebarHeader);
                funcGetSidebarItem();
            }else{
                funcGenerate();
            }
        }
    });

    // Get sidebar menu
    var sidebarMenu = [];
    var funcGetSidebarItem = ()=>{
        frappe.call({
            method:"bdtheme.provider.get_resource_complete",
            args: {
                parent_table:"tabSidebar Menu",
                child_tables:'[["submenu", "tabSidebar Menu Items"]]'
            },
            callback: function(r) {
                if(r.message){
                    sidebarMenu = r.message.sort((a,b) => (a.urutan > b.urutan) ? 1 : ((b.urutan > a.urutan) ? -1 : 0));
                    console.log("Sidebar Menu", sidebarMenu);
                    funcGenerate();
                }else{
                    funcGenerate();
                }
            }
        });
    }

    
    var funcGenerate = ()=>{
        // Add sidebar container
        var ret = $.parseHTML('\
        <aside class="main-sidebar">\
            <section class="sidebar">\
                <ul class="sidebar-menu">\
                </ul>\
            </section>\
        </aside>\
        <div class="overlay">\
            <div>\
        ');
        var menu = $(ret).find('.sidebar-menu');

        // Add sidebar header&item from doctype
        sidebarHeader.forEach(el => {
            menu.append('<li class="header">' + el.title + '</li>');

            sidebarMenu.filter(m => m.header == el.title).forEach(el=>{
                var li = $.parseHTML('\
                    <li class="treeview">\
                        <a href="#">\
                            <i class="'+el.icon+'"></i>\
                            <span>'+el.title+'</span>\
                            <span class="pull-right-container">\
                                <i class="fa fa-angle-left pull-right"></i>\
                            </span>\
                        </a>\
                        <ul class="treeview-menu"></ul>\
                    </li>\
                ');


                el.submenu.forEach(el=>{
                    $(li).find('.treeview-menu').append('\
                        <li><a href="'+el.href+'"><i class="'+el.icon+'"></i> '+el.title+'</a></li>\
                    ')
                });

                menu.append(li);
            });
        });
        

        // Add default menu item
        menu.append('\
            <li class="header">Other</li>\
            <li>\
                <a href="#modules/Setup"><i class="fa fa-cog"></i> <span>Setup</span></a>\
            </li>\
        ')

        callback(ret);
    }
}

bdtheme.set_user_background = function(src, selector, style){
	if(!selector) selector = "#page-desktop";
	if(!style) style = "Fill Screen";
	if(src) {
		if (window.cordova && src.indexOf("http") === -1) {
			src = frappe.base_url + src;
		}
		var background = repl('background: url("%(src)s") center center;', {src: src});
	} else {
		var background = "background-color: #FFFFFF;";
	}

	frappe.dom.set_style(repl('%(selector)s { \
		%(background)s \
		%(style)s \
	}', {
		selector:selector,
		background:background,
		style: ""
	}));
}

frappe.templates["logo"] = '<a href="/desk" class="logo">'
+     ' <span class="logo-mini"><b>bd</b></span>'
+'      <span class="logo-lg"><b>bdoop</b></span>'
+'    </a>';

frappe.templates["sidebar-toggle"] = '<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">'
+	        '<span class="sr-only">Toggle navigation</span>'
+	    '</a>';