import { SearchBar as Searchbar } from '@rneui/themed';
import { Platform } from 'react-native';
import { TextInputProps } from "react-native";
import colors from '../Constants/Colors';



/**
 * Creates a searchbar that the user can use to search
 * @param props The properties of the search bar
 */
export function SearchBar(props: TextInputProps) {
    return <Searchbar
        platform={Platform.OS === "ios" ? "ios" : "android"}
        containerStyle={{ backgroundColor: "#f2f2f2", height: 60, paddingHorizontal: Platform.OS === "android" ? 10 : undefined }}
        inputContainerStyle={{ backgroundColor: "#ddd", height: 40 }}
        inputStyle={{ color: "#000" }}
        cancelButtonProps={{ color: colors.blue }}
        
        {...props}
    />
}