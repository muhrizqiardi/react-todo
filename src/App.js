import React, { useState, useEffect } from 'react';
import { Button, Box, Paper, List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, IconButton, makeStyles, Fab, TextField } from '@material-ui/core';
import todo from './todo.json'
import './style/style.scss';
import './style/bg.scss';
import { styled } from '@material-ui/styles';
import { Add, Delete } from '@material-ui/icons';
import axios from 'axios';

function App() {
  const [data, setData] = useState();
  const [newValue, setNewValue] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date('2014-08-18T21:11:54'));

  const handleCheck = (index) => {
    let dataCopy = [...data];
    dataCopy[index].done = !dataCopy[index].done;
    setData(dataCopy);
  }
  const handleDelete = (id) => {
    console.log(id)
    let dataCopy = [...data];
    console.log(dataCopy)
    dataCopy = dataCopy.filter(todo => todo["_id"] !== id);
    setData(dataCopy);

    // Create a DELETE request to the API
    axios.delete('http://localhost:3001/api/todo', {
      data: {
        id: id
      }
    })
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      });
  }
  const handleAdd = (title) => {
    let dataCopy = [...data];
    dataCopy.unshift({
      "title": title,
      "due": new Date(Date.parse(selectedDate)).toLocaleString(),
      "done": false
    });
    console.log(dataCopy)
    setData(dataCopy);

    // Create a POST request to the API 
    axios.post('http://localhost:3001/api/todo', {
      "title": dataCopy[0].title,
      "due": dataCopy[0].due,
      "done": dataCopy[0].done
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/todo');
      console.log('Success!');
      setData(res.data);
    } catch (e) {
      console.error('Failure!');
      throw new Error(e);
    }
  }

  // Run on load
  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div className="App">
      <Paper style={{ "overflow-y": 'auto', overflowX: 'hidden', minWidth: 400, maxHeight: "80vh", padding: 20 }}>
        <h1 style={{ textAlign: 'center' }}>To Do List</h1>
        <Box style={{ display: 'grid', gridTemplateColumns: "80fr 20fr", rowGap: 10, width: "100%" }}>
          <TextField id="outlined-basic" label="Add To Do" variant="outlined" style={{ width: "100%" }}
            onChange={(event) => setNewValue(event.target.value)} />
          <Button disableRipple variant="outlined" color="primary" style={{ marginLeft: 5 }} onClick={() => handleAdd(newValue)}>
            <Add />
          </Button>
          <TextField
            id="date"
            variant="outlined"
            label="Set due date"
            type="date"
            style={{ gridColumn: "1 / 3" }}
            onChange={(event) => handleDateChange(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
          <TextField
            id="date"
            variant="outlined"
            label="Set due time"
            type="time"
            style={{ gridColumn: "1 / 3" }}
            onChange={(event) => handleDateChange(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Box>
        <List disableRipple className="List">
          {data && data.map((element) => {
            return (
              <ListItem
                disableRipple
                button
                style={{
                  textDecoration: element.done ? 'line-through' : 'none',
                  color: element.done ? 'gray' : 'black',
                }}
                onClick={() => handleCheck(element["_id"])}
              >
                <ListItemIcon>
                  <Checkbox
                    color="primary"
                    checked={element.done}
                  >
                  </Checkbox>
                </ListItemIcon>
                <ListItemText
                  primary={element.title}
                  secondary={element.done ? "" : `Due at ${new Date(Date.parse(element.due)).toLocaleString()}`}
                />
                <ListItemSecondaryAction onClick={() => handleDelete(element["_id"])} >
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </Paper>

    </div>
  );
}

export default App;
