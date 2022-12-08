# Team-15-Project_3


# Getting Started
- Clone repository
- Open terminal and run `cd backend`, and `npm install`, and `npm start`
- Open new terminal and run `cd frontend` and `npm install`, and `npm start`
- Happy Coding!

# Backend
Backend currently uses node.js and express.js
You need a `.env` file with secret keys for **Google Translate** and the **SQL Database** URL

# Frontend
Frontend currently uses React.js 
There are several components and **routes** that website currently runs in 

## Manager
Found in `frontend/src/pages/manager/Manager.js`
`Manager.js` displays 4 tabs with a list of tables
  - `./Inventory.js`
  - `./MyMenu.js`
  - `./Reports.js`
  - `./Access.js`

There are also some components that are used for user input
  - `./InventoryDialog.js`
  - `./MyMenuDialog.js`
  
### Inventory
Stores information on current count of ingredients and materials in stock. Information is retrieved from the database hosted on AWS.

-----

```js
export default function Inventory()
```
Component for table displaying inventory levels
#### Returns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;React component for displaying an inventory table

-----


```js
const handleEdit = (dat) => {}
```
Handler for editing inventory levels
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**dat** - Row to replace in inventory

-----

```js
const handleDelete = (dat) => {}
```
Handler for removing inventory entries
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**dat** - Row to remove from the inventory

-----

```js
const handleDialogClose = () => {}
```
Closes popup for editing inventory items

-----

```js
const handleDialogUpdate = (name, quantity, id) => {}
```
Handles adding inventory entries
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**name** - Name for the inventory item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**quantity** - Amount of item in inventory
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**id** - Numerical identifier for inventory item

-----

```js
const handleAddDialogOpen = () => {}
```
Opens dialog box for adding inventory items

-----

```js
const handleAddDialogClose = () => {}
```
Closes dialog box for adding inventory items

-----

```js
const handleAddDialogUpdate = (name, quantity) => {}
```
Handles adding a new inventory item to the inventory
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**name** - Name for the inventory item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**quantity** - Amount of item to add to inventory

-----

### InventoryDialog
The Inventory view uses a dialog component which renders a pop up menu for entering input

-----

```js
export default function InventoryDialog({open, onClose, onUpdate, _name, _quantity, _id}) {}
```
Renders popup dialog box for making changes to the inventory
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**open** - Handler for opening dialog box
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**onClose** - Handler for closing dialog box
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**onUpdate** - Handler for updating inventory
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**_name** - Current name of item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**_quantity** - Current quantity of item in inventory
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**_id** - Current identifier of item
#### Returns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;React component for rendering an inventory update menu

-----

```js
const handleNameChange = (e) => {}
```
Handler for name changes
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**e** - Event causing change

-----

```js
const handleQuantityChange = (e) => {}
```
Handler for quantity changes
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**e** - Event causing change

-----

```js
const handleUpdate = () => {}
```
Handler for updating inventory

-----

```js
const handleClose = () => {}
```
Handles closing the dialog box

-----

### MyMenu
React component for creating a menu table view. Allows for viewing current menu items, and can add and remove menu items.

-----

```js
function createData(name, id, price, type, ingredients) {}
```
Creates menu item object with specified characteristics
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**name** - Name of menu item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**id** - Numerical identifier for menu item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**price** - Price of menu item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**type** - Type of menu item (Entree, Side, Appetizer, Dessert)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**ingredients** - List of ingredients that the menu item needs
#### Returns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Menu item object holding the passed data

-----

```js
function createIngrData(name, id, amount) {}
```
Creates ingredient object with specified characteristics
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**name** - Name of ingredient
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**id** - Numerical identifier for ingredient
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**amount** - Amount of ingredient used in menu item
#### Returns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ingredient object holding the passed data

-----

```js
function Row({row, handleDelete}) {}
```
Component for rendering a row in the menu table
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**row** - Row to render
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**handleDelete** - Handler for deleting row
#### Returns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;React component for rendering menu row

-----

```js
export default function MyMenu() {}
```
Component for rendering the menu view
#### Returns
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;React component for rendering the menu view

----

```js
const handleOpen = () => {}
```
Handler for opening dialog box

-----

```js
const handleClose = () => {}
```
Handler for closing dialog box

-----

```js
function handleDelete(id) {}
```
Handler for deleting a menu item
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**id** - Numerical identifier of menu item to be removed

-----

```js
const addMenuItem = (newName, newIngredients, newPrice, newType) => {}
```
Handler for adding a new menu item
#### Parameters
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**newName** - Name of new menu item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**newIngredients** - List of ingredients used in menu item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**newPrice** - New price of menu item
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**newType** - New type of menu item

-----






## Customer
Found in `frontend/src/pages/customer/Customer.js`
`Customer.js` displays 2 views
  - `frontend/src/pages/view/OrderView.js`
  - `frontend/src/pages/view/PlateView.js`

## Cashier 
Found in `frontend/src/pages/cashier/Cashier.js`
`Cashier.js` displays 2 views
  - `frontend/src/pages/view/OrderView.js`
  - `frontend/src/pages/view/PlateView.js`
