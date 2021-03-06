# -*- coding: utf-8 -*-
# Copyright (c) 2018, vinhbk2000 and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class SidebarMenu(Document):
    @frappe.whitelist()
    def get_resource_complete(parent_table, child_tables):
        """get table and child tables

        args:
        parent_table -- parent table name
        child_tables -- list of [target column name, child table name] ex: [['items', 'tabDetail']]
        """
        parent = frappe.db.sql("SELECT * FROM `%s`" % parent_table, as_dict=True)
        parent_length = len(parent)
        for child in child_tables:
            tmp = frappe.db.sql("SELECT * FROM `%s`" % child[1], as_dict=True)
            ln = len(tmp)
            for i in range(ln):
                for j in range(parent_length):
                    if tmp[i]["parent"] == parent[j]["name"]:
                        if child[0] not in parent[j]:
                            parent[j][child[0]] = []
                        parent[j][child[0]].append(tmp[i])
                        break
        return parent
