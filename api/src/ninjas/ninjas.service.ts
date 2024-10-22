import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';

@Injectable()
export class NinjasService {
    ninjas = [
        {
            id: 1,
            name: "Mahery",
            attribute: "water"
        }, 
        {
            id: 2,
            name: "Njaka",
            attribute: "flame"
        }
    ]

    getNinjas()
    {
        return this.ninjas;
    }

    getOneNinja(id: number)
    {
        const ninja = this.ninjas.filter(ninja => ninja.id === id);
        if(ninja.length === 0){
            throw new Error("This ninja doesn't exist")
        }

        return ninja;
    }

    createNinja(createNinjaDto: CreateNinjaDto)
    {
        const newNinja = {id: Date.now(), ...createNinjaDto};
        this.ninjas = [...this.ninjas, newNinja];

        return this.ninjas;
    }

    updateNinja(id: number, data: CreateNinjaDto){
        this.ninjas = this.ninjas.map(ninja => {
            if(ninja.id === id){
                return {...ninja, ...data};
            }
        });

        return this.getOneNinja(id);
    }

    deleteNinja(id: number)
    {
        const deletedNinja = this.getOneNinja(id);

        this.ninjas = this.ninjas.filter(ninja => ninja.id !== id);

        return deletedNinja;
    }
    
}
