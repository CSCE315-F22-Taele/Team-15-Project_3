import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../config/global.js";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function userType(val) {
	switch(val) {
		case 0:
			return "User";
		case 1:
			return "Staff";
		case 2:
			return "Manager";
		default:
			return "???"
	}
}

export default function UserPerm() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const options = {
		  method: "GET",
		  url: `${url}/userPerm`,
		};
		axios.request(options).then((res) => {
		  let rows = res.data.rows;
		  setData(rows);
		});
	}, []);

	return (
		<TableContainer sx={{ maxHeight: 340 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
		<TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
			  <TableCell>Last Name</TableCell>
              <TableCell>Permission</TableCell>
            </TableRow>
          </TableHead>
		<TableBody>
			{data.map((row) => (
				<TableRow
                key={row.email}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              	>
				<TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell align="left">{row.first_name}</TableCell>
				<TableCell align="left">{row.last_name}</TableCell>
                <TableCell align="left"><script>userType({row.permission});</script></TableCell>
				</TableRow>
			))}
		</TableBody>
		</Table>
      	</TableContainer>
	);
}