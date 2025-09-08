#
What It Is

This is a Kitchen Display System (KDS) for Grade‑A Catering. It replaces paper tickets with a simple screen that shows orders as cards. Orders can be marked New → In‑Progress → Complete. The system highlights serve times (ST/DT), allows filtering by station, and shows upcoming orders for the next 3 days.



##How To Start

Orders are pulled automatically by a script and saved into the database.

Open the main page (index.html) in your browser.

Orders will appear on screen as cards you can filter by station or date.

Click an order card to change its status (New → In‑Progress → Complete).

##Order File Format

The system expects these columns:

OrderID, Ref, Station, Item, Qty, ST, DT, Day, Disposable, Notes

OrderID: unique number for the order line

Station: where it belongs (Grill, Fry, Salad, Dessert, etc.)

Item: what the order is

Qty: how many

ST/DT: times for the station and delivery

Day: the date

Disposable: Yes/No

Notes: any extra details

Auto‑Import (CSV → Database)

We’re adding a small script that will automatically pull the daily CSV and load it into the database so the KDS stays up‑to‑date without anyone uploading files.

###What it does

Checks a shared folder or link for today’s CSV.

Loads new/changed orders into the database (no duplicates).

Saves a copy of the file into an Archive folder by date.

Writes a simple log so we can see if everything worked.

###How it runs

It runs on a schedule (every 5–10 minutes or hourly).

If the file isn’t there yet, it tries again later.

###What we’ll need

The place to pull the CSV from (shared drive or link).

Database login the script can use.

If something goes wrong

The script logs the error and keeps the last good data in the KDS.

###Current Setup

Running on a Hyper‑V virtual machine with Apache (web server) and MySQL (database).

A script automatically pulls the latest CSV file and loads it into the database — no manual upload needed.

User accounts for SSH and MySQL will be provided.

The team is considering using VPN access for secure connections to the Grade‑A network.

###Goal

Make the kitchen faster and more organized by:

Removing paper tickets

Keeping all stations on the same page

Saving Grade‑A Catering time and costs every day

Staying synced automatically via the CSV auto‑import script Make the kitchen faster and more organized by:

Removing paper tickets

Keeping all stations on the same page

Automating order imports into the database

Saving Grade‑A Catering time and costs every day.
