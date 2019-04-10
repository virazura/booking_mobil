from __future__ import unicode_literals
from frappe import _

def get_data():
    return[
        {
            "label": _("Master"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Master Customer"
                },
                {
                    "type": "doctype",
                    "name": "Master Mobil"
                },
                {
                    "type": "doctype",
                    "name": "Master Tipe Mobil"
                },
                {
                    "type": "doctype",
                    "name": "Master Driver"
                },
            ]
        },
        {
            "label": _("Transaction"),
            "items": [
                {
                    "type": "doctype",
                    "name": "Sales Order Mobil"
                },
                {
                    "type": "doctype",
                    "name": "Kontrak Payung"
                },
                {
                    "type": "doctype",
                    "name": "Sales Invoice Mobil"
                },
                {
                    "type": "doctype",
                    "name": "Delivery Order"
                },
                {
                    "type": "doctype",
                    "name": "Get Passed"
                },
                {
                    "type": "doctype",
                    "name": "Rencana Tarik Kendaraan"
                }
            ]
        }
    ]