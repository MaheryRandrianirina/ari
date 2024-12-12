import Grid from '@mui/system/Grid';
import { Task, User } from '../../App';
import { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Alert, Button, Card, CardActionArea, CardContent, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import { handleTokenExpiration } from '../../utils/handleTokenExpiration';
import LoadingButton from '@mui/lab/LoadingButton';
import { TasksStatus, useTaskForm } from './hooks/useTaskForm';
import { TaskResponsible } from './TaskResponsible';
import { Delete, get, post } from '../../common/utils/api';
import { TokenContext } from '../../common/contexts/TokenContext';


export function Tasks({users}:{
    readonly users: User[]
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
    
    const setToken = useContext(TokenContext);

    useEffect(()=>{
        const fetchTasks = async()=>{
            try {
                const res = await get("tasks");
                if(res.data.tasks.length > 0){
                    const tasks = res.data.tasks as Task[];
                    setTasks({
                        done: tasks.filter(task => task.status === "done"),
                        in_progress: tasks.filter(task => task.status === "in progress"),
                        not_done: tasks.filter(task => task.status === "not done")
                    });
                }
            }catch(e){
                const error = e as AxiosError;
                if(error.status === 401) {
                    handleTokenExpiration(setToken);
                    fetchTasks();
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
            const {data}: AxiosResponse<{task: Task}> = await post("tasks/new", {task: newTaskValue});
            
            setTasks(tasks => ({
                not_done: [...tasks.not_done, data.task],
                in_progress: tasks.in_progress,
                done: tasks.done
            }));
        }catch(e){
            const err = e as AxiosError;
            if(err.status === 401) {
                handleTokenExpiration(setToken);
            }

            setTaskError(true);
        }

        setLoadingTaskSaving(false);
        
    }

    const tasksAreEmpty = tasks.done.length === 0 && tasks.in_progress.length === 0 && tasks.not_done.length === 0;
    return <>
        <Typography variant="h5" gutterBottom align="left" sx={{mt: 3}}>Tasks</Typography>
        <div style={{display: "flex", justifyContent:"flex-start", marginBottom:"8px"}} onClick={handleToggleNewTaskForm}>
            <Button variant="outlined" sx={{mb:1}}>Add new task</Button>
        </div>

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
                        <TasksList users={users} setTasks={setTasks} setToken={setToken} tasks={tasks.not_done} status='not done'/>
                    </Grid>
                    <Grid size={3}>
                        <TasksList setTasks={setTasks} setToken={setToken} tasks={tasks.in_progress} status='in progress'/>
                    </Grid>
                    <Grid size={3}>
                        <TasksList setTasks={setTasks} setToken={setToken} tasks={tasks.done} status='done'/>
                    </Grid>
                </>
            }
        </Grid>
    </>
}

function TasksList({tasks, setTasks, status, setToken, users}:{
    readonly tasks: Task[], 
    readonly setTasks:Dispatch<SetStateAction<TasksStatus>>,
    readonly status: "not done"|"in progress"|"done",
    readonly setToken:Dispatch<SetStateAction<string|null>>,
    readonly users?: User[]
    
}){
    const [taskIdWithExpandedResponsible, setTaskIdWithExpandedResponsible] = useState<string[]>([]);

    const handleDeleteTask = async(task_id: string)=>{
        try {
            await Delete(`tasks/${task_id}`);
            setTasks(tasks => ({
                    not_done: tasks.not_done.filter(task => task._id !== task_id),
                    in_progress: tasks.in_progress.filter(task => task._id !== task_id),
                    done: tasks.done.filter(task => task._id !== task_id)
                })
            )
        }catch(e){
            const error = e as AxiosError;
            if(error.status === 401) {
                handleTokenExpiration(setToken);
                handleDeleteTask(task_id);
            }
        }
    }

    const handleExpandTaskResponsible = (task_id:string)=>{
        setTaskIdWithExpandedResponsible(taskIdWithExpandedResponsible => taskIdWithExpandedResponsible.includes(task_id) 
            ? taskIdWithExpandedResponsible.filter(taskId => taskId !== task_id) 
            : [...taskIdWithExpandedResponsible, task_id]);
    }
    
    return <Box component="section" sx={{ p: 2, borderRadius:1, boxShadow: "0 0 10px #ccc" }}>
        <Typography variant="h6" gutterBottom align="left">{status}</Typography>
        <List sx={{ width: '100%', maxWidth: 360 }}>
            {tasks.map((task, idx) => {
            const labelId = `checkbox-list-label-${idx}`;

            return (
                <div key={task.name}>
                    <ListItem
                        disablePadding
                        secondaryAction={
                            <IconButton edge="end" aria-label="comments" onClick={(e)=> {
                                e.preventDefault();
                                handleDeleteTask(task._id)
                            }}>
                                <DeleteIcon color='error'/>
                            </IconButton>
                        }
                        
                    >
                        <ListItemButton role={undefined} onClick={() => handleExpandTaskResponsible(task._id)} dense>
                            <ListItemText id={labelId} primary={`${task.name}`} />
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={taskIdWithExpandedResponsible.includes(task._id)} timeout="auto">
                        {status === "not done" && <TaskResponsible taskId={task._id} responsibleId={task.user_id} users={users}/>}
                    </Collapse>
                </div>
            );
            })}
        </List>
    </Box>
}