import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { GROUP_COLLECTION } from "../storageConfig";
import { groupsGetAll } from "./groupsGetAll";

export async function groupCreate(newGroup: string) {
    try{
        const storedGroup = await groupsGetAll();
    
        const storage = JSON.stringify([...storedGroup, newGroup]);
        await AsyncStorage.setItem(GROUP_COLLECTION, storage);
    } catch(error) {
        throw error;
    }
}