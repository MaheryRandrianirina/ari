import { Dispatch, SetStateAction, useState } from "react";
import { Task } from "../../../App";


export type TasksStatus = {
    done: Task[],
    in_progress: Task[],
    not_done: Task[]
};

export const useTaskForm = ():[
    TasksStatus,
    Dispatch<SetStateAction<TasksStatus>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    string,
    Dispatch<SetStateAction<string>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    boolean,
    Dispatch<SetStateAction<boolean>>
]=>{
    const [tasks, setTasks] = useState<TasksStatus>({
        done: [],
        in_progress: [],
        not_done: []
    });
    const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
    const [newTaskValue, setNewTaskValue] = useState<string>("");
    const [loadingTaskSaving, setLoadingTaskSaving] = useState<boolean>(false);
    const [taskError, setTaskError] = useState<boolean>(false);

    return [tasks, setTasks, showTaskForm, setShowTaskForm, newTaskValue, setNewTaskValue, loadingTaskSaving, setLoadingTaskSaving, taskError, setTaskError]
}