# Module: OpenTherm
This module information from your OpenTherm gateway.

For this to work you'll need:

An OpenTherm controlled heating/cooling device
An OpenTherm gateway http://otgw.tclcode.com/
The OpenTherm Monitor application running somewhere http://otgw.tclcode.com/otmonitor.html

NOTE: The otmonitor version hosted on the website doesn't have the access-allow-origin-header so the browser running MM will probably reject the json response. Luckily the author also supplies the source and instructions on how to build/compile your own version.

I've compiled a (RpI) version of the otmonitor program with this header included. Anyone in need of if, please let me know.


## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	 {
			module : 'MMM-OpenTherm',
			position : 'top_right',
			config : {
				apiBase : "http://192.168.1.xxx:8080/json"
			}
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>

		<tr>
			<td><code>apiBase</code></td>
			<td>The url to your OpenTherm gateway monitor<br>
				<br><b>Example:</b> <code>http://192.168.1.xxx:8080/json</code>
				<br><b>Default value:</b> <code> none</code>
			</td>
	</tbody>
</table>
# MMM-OpenTherm
