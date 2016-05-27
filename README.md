# Module: OpenTherm
This module information from your OpenTherm gateway.

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
