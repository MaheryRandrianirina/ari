import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { put } from '../../../../common/utils/api';
import { TokenContext } from '../../../../common/contexts/TokenContext';
import { AxiosError } from 'axios';
import { handleTokenExpiration } from '../../../../utils/handleTokenExpiration';
import { Task } from '../../../../App';

const Input = styled(MuiInput)`
  width: 42px;
`;

let valueChangeTimer:number;

const updateTaskProgress = async(task_id:string, progress:number, setToken:Dispatch<SetStateAction<string | null>>, token:string|null)=>{
  clearTimeout(valueChangeTimer);
  
  valueChangeTimer = setTimeout(async()=>{
    try {
      await put(`tasks/${task_id}`, {progress}, token);
    } catch (e) {
      const err = e as AxiosError<{message:string}>;
      if(err.status === 401 && err.response?.data.message.toLowerCase() === "token has expired") {
        handleTokenExpiration(setToken);
        await updateTaskProgress(task_id, progress, setToken, token);
      }
    }
  }, 1000);
  
}

export function TaskProgress({task}: {readonly task:Task}) {
  const taskProgressValue = task.progress;
  const [value, setValue] = useState(taskProgressValue);

  const {token, setToken} = useContext(TokenContext);

  const handleSliderChange = async(event: Event, newValue: number | number[]) => {
    const newValueNb = newValue as number;
    setValue(newValueNb);
    
    await updateTaskProgress(task._id, newValueNb, setToken, token);
    
  };

  const handleInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    setValue(newValue);

    await updateTaskProgress(task._id, newValue, setToken, token);
  };

  // avoir having a value less than 0 or greater than 100 
  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid sx={{width: "60%"}}>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid>
          <Input
            value={`${value}%`}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'string',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
