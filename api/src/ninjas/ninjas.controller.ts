import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { NinjasService } from './ninjas.service';
import { BeltGuard } from 'src/belt/belt.guard';

@Controller('ninjas')
export class NinjasController {

    constructor(private readonly ninjaService: NinjasService){}

    @Get()
    getNinjas()
    {
        return this.ninjaService.getNinjas();
    }

    @Get(":id")
    getOneNinja(@Param("id", ParseIntPipe) id: number)
    {
        try {
            return this.ninjaService.getOneNinja(id);
        }catch(e){
            throw new NotFoundException();
        }
    }

    @Post()
    @UseGuards(BeltGuard)
    createNinja(@Body() createNinjaDto: CreateNinjaDto)
    {
        return this.ninjaService.createNinja(createNinjaDto);
    }

    @Put(":id")
    updateNinja(@Param("id") id: string, @Body() ninja: CreateNinjaDto)
    {
        return this.ninjaService.updateNinja(+id, ninja);
    }

    @Delete(":id")
    deleteNinja(@Param("id") id: string)
    {
        return this.ninjaService.deleteNinja(+id);
    }
}
