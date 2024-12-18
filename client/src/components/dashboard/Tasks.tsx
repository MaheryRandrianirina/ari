import Grid from '@mui/system/Grid';
import { Task, User } from '../../App';
import { Dispatch, DragEvent, MouseEventHandler, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Alert, Button, Card, CardActionArea, CardContent, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import { handleTokenExpiration } from '../../utils/handleTokenExpiration';
import LoadingButton from '@mui/lab/LoadingButton';
import { TasksStatus, useTaskForm } from './hooks/useTaskForm';
import { TaskResponsible } from './TaskResponsible';
import { Delete, get, post, put } from '../../common/utils/api';
import { TokenContext } from '../../common/contexts/TokenContext';
import { ConnectedUserContext } from '../../common/contexts/ConnectedUserContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { TaskProgress } from './user/components/TaskProgress';

/**
 * Lists every tasks per status ('not done', 'in progress', 'done')
 * Interface is adapted dependind on connected user role ("user"|"admin")
 */
export function Tasks({users}:{
    readonly users?: User[]
}){
    const [
        tasks, 
        setTasks, 
        showTaskForm, 
        setShowTaskForm, 
        newTaskValue, 
        setNewTaskValue, 
        loadingTaskSaving, 
        setLoadingTaskSaving, 
        taskError, 
        setTaskError
    ] = useTaskForm();
    
    const {setToken, token} = useContext(TokenContext);
    const connectedUser = useContext(ConnectedUserContext);

    useEffect(()=>{
        const fetchTasks = async()=>{
            try {
                let res;
                // There is something that not works good here cause is always returns "unauthorized status"
                if(connectedUser?.role === "admin") {
                    res = await get("tasks", token)
                }else {
                    res = await get(`tasks/user/${connectedUser?._id}`, token);
                } 

                if(res.data.tasks.length > 0){
                    const tasks = res.data.tasks as Task[];
                    setTasks({
                        done: tasks.filter(task => task.status === "done"),
                        in_progress: tasks.filter(task => task.status === "in progress"),
                        not_done: tasks.filter(task => task.status === "not done")
                    });
                }
            }catch(e){
                const error = e as AxiosError<{message:string}>;
                if(error.status === 401 && error.response?.data.message.toLowerCase() === "token has expired") {
                    handleTokenExpiration(setToken);
                    await fetchTasks();
                }
            }
        }

        fetchTasks();
    }, []);

    const handleToggleNewTaskForm: MouseEventHandler<HTMLDivElement> = (e)=>{
        e.preventDefault();

        setShowTaskForm(showTaskForm => !showTaskForm);
    } 

    const handleSaveNewTask: MouseEventHandler<HTMLButtonElement> = async(e)=>{
        e.preventDefault();

        if(taskError) setTaskError(false);

        setLoadingTaskSaving(true);

        try {
            const {data}: AxiosResponse<{task: Task}> = await post("tasks/new", {task: newTaskValue}, token);
            
            setTasks(tasks => ({
                not_done: [...tasks.not_done, data.task],
                in_progress: tasks.in_progress,
                done: tasks.done
            }));
        }catch(e){
            const err = e as AxiosError<{message:string}>;
            if(err.status === 401 && err.response?.data.message.toLowerCase() === "token has expired") {
                handleTokenExpiration(setToken);
            }

            setTaskError(true);
        }

        setLoadingTaskSaving(false);
        
    }

    const tasksAreEmpty = tasks.done.length === 0 && tasks.in_progress.length === 0 && tasks.not_done.length === 0;
    return <>
        <Typography variant="h5" gutterBottom align="left" sx={{mt: 3}}>Tasks</Typography>

        {connectedUser?.role === "admin" && <div style={{display: "flex", justifyContent:"flex-start", marginBottom:"8px"}} onClick={handleToggleNewTaskForm}>
            <Button variant="outlined" sx={{mb:1}}>Add new task</Button>
        </div>}

        {showTaskForm && 
        <Box sx={{maxWidth:345}}>
            {taskError &&
                <Alert severity="error" sx={{mb:1}}>Error has occured while saving the task. Please try again !</Alert>}
            <Card sx={{ maxWidth: 345, mb:2 }}>
                <CardActionArea>
                    <TextField
                        id="filled-basic"
                        variant="filled"
                        label="New task"
                        placeholder="Task name"
                        value={newTaskValue}
                        fullWidth
                        onChange={(e)=> {
                            setTaskError(false);
                            setNewTaskValue(e.currentTarget.value)
                            }}
                        
                    />
                    <CardContent sx={{p:0}}>
                        <LoadingButton 
                            fullWidth 
                            variant="contained" 
                            sx={{borderRadius:0}} 
                            onClick={handleSaveNewTask}
                            loading={loadingTaskSaving}
                            disabled={loadingTaskSaving}
                        >Save</LoadingButton>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
        }

        <Grid container spacing={4}>
            {tasksAreEmpty && <Typography>There are no tasks yet</Typography>}
            {!tasksAreEmpty && 
                <>
                    <Grid size={3}>
                        <TasksList users={users} setTasks={setTasks} setToken={setToken} token={token} tasks={tasks.not_done} status='not done'/>
                    </Grid>
                    <Grid size={3}>
                        <TasksList setTasks={setTasks} setToken={setToken} token={token} tasks={tasks.in_progress} status='in progress'/>
                    </Grid>
                    <Grid size={3}>
                        <TasksList setTasks={setTasks} setToken={setToken} token={token} tasks={tasks.done} status='done'/>
                    </Grid>
                </>
            }
        </Grid>
    </>
}

function TasksList({tasks, setTasks, status, setToken, token, users}:{
    readonly tasks: Task[], 
    readonly setTasks:Dispatch<SetStateAction<TasksStatus>>,
    readonly status: "not done"|"in progress"|"done",
    readonly setToken:Dispatch<SetStateAction<string|null>>,
    readonly token: string|null,
    readonly users?: User[]
    
}){
    const authUser = useContext(ConnectedUserContext);
    const setSnackbarMessage = useContext(SnackbarContext);

    const [taskIdWithExpandedResponsible, setTaskIdWithExpandedResponsible] = useState<string[]>([]);

    const listRef = useRef();

    const handleDeleteTask = async(task_id: string)=>{
        try {
            await Delete(`tasks/${task_id}`, token);

            setTasks(tasks => ({
                    not_done: tasks.not_done.filter(task => task._id !== task_id),
                    in_progress: tasks.in_progress.filter(task => task._id !== task_id),
                    done: tasks.done.filter(task => task._id !== task_id)
                })
            )
        }catch(e){
            const error = e as AxiosError<{message:string}>;
            if(error.status === 401 && error.response?.data.message.toLowerCase() === "token has expired") {
                handleTokenExpiration(setToken);
                handleDeleteTask(task_id);
            }
        }
    }

    const handleExpandTask = (task_id:string)=>{
        setTaskIdWithExpandedResponsible(taskIdWithExpandedResponsible => taskIdWithExpandedResponsible.includes(task_id) 
            ? taskIdWithExpandedResponsible.filter(taskId => taskId !== task_id) 
            : [...taskIdWithExpandedResponsible, task_id]);
    }

    const handleDragTask = (e: DragEvent, task_id:string)=>{
        e.dataTransfer.setData("task_id", task_id);
        e.dataTransfer.setData("element", e.currentTarget.id);
    }

    const allowDrop = (e: DragEvent)=>{
        e.preventDefault();
    }
    
    const handleDrop = async(e:DragEvent)=>{
        const task_id = e.dataTransfer.getData('task_id');
        const element_id =  e.dataTransfer.getData('element');
        const element = document.querySelector(`#${element_id}`);
        const droppededElement = element?.parentElement?.parentElement;
        
        const listElement = listRef.current;
        const newStatus = listElement.previousElementSibling.innerText;
        try {
            await put(`tasks/${task_id}`, {status:newStatus}, token);

            listElement.appendChild(droppededElement);
        }catch(e) {
            const err = e as AxiosError<{message:string}>;
            if(err.status === 401 && err.response?.data.message.toLowerCase() === "token has expired") handleTokenExpiration(setToken);
            else if(err.status === 500) {
                setSnackbarMessage(err.response?.data.message as string);
            }
        }
    }

    return <Box component="section" sx={{ p: 2, borderRadius:1, boxShadow: "0 0 10px #ccc" }} onDragOver={allowDrop} onDrop={handleDrop}>
        <Typography variant="h6" gutterBottom align="left">{status}</Typography>
        <List sx={{ width: '100%', maxWidth: 360 }} ref={listRef}>
            {tasks.map((task, idx) => {
            const labelId = `checkbox-list-label-${idx}`;
            
            return (
                <div key={task.name}>
                    <ListItem
                        disablePadding
                        secondaryAction={
                            authUser?.role === "admin" && <IconButton edge="end" aria-label="comments" onClick={(e)=> {
                                e.preventDefault();
                                handleDeleteTask(task._id)
                            }}>
                                <DeleteIcon color='error'/>
                            </IconButton>
                        }                        
                    >
                        <ListItemButton 
                            id={`task_${task._id}`}
                            draggable
                            role={undefined} 
                            onClick={() => handleExpandTask(task._id)} 
                            dense
                            onDragStart={authUser?.role === "user" ? (e)=>handleDragTask(e, task._id) : undefined}
                        >
                            <ListItemText id={labelId} primary={`${task.name}`} />
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={taskIdWithExpandedResponsible.includes(task._id)} timeout="auto">
                        {(status === "in progress") && <TaskProgress task={task}/>}
                        {(authUser?.role === "admin") && <TaskResponsible taskId={task._id} responsibleId={task.user_id} users={users}/>} 
                    </Collapse>
                </div>
            );
            })}
        </List>
    </Box>
}