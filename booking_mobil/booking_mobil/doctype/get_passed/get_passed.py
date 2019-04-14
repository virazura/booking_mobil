# -*- coding: utf-8 -*-
# Copyright (c) 2019, Kelompok Booking Mobil and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class GetPassed(Document):
	pass

	def validate(self):
		self.change_status_delivery()

	def change_status_delivery(self):
		if(self.id_customer):
			delivery = frappe.get_doc("Delivery Order", self.id_customer)
			delivery.status_delivery = 'Delivered'
			delivery.save()
		