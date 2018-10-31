$(document).ready(function() {
	$('header').prepend(frappe.render_template("logo"));
	$('header .navbar .container').prepend(frappe.render_template("sidebar-toggle"));
    // $('.main-section').append(frappe.render_template("main-sidebar"));
    
    genereate_side_menu((ret)=>{
        $('.main-section').append(ret);
    })
    

	$('header').addClass('main-header');
	$('header .navbar').removeClass('navbar-fixed-top');
	$('body').addClass('skin-blue sidebar-mini sidebar-collapse');	
	$('#body_div').addClass('content-wrapper');	
	
	bdtheme.set_user_background();
	
});

frappe.provide("bdtheme");

// add toolbar icon
$(document).bind('toolbar_setup', function() {
	frappe.app.name = "bdoop Erp";
	$('.navbar-home').html(frappe._('Home'));
});


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