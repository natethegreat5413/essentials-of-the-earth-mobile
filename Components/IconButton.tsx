import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons'; 



/**
 * Crates a button with an icon 
 * @param type The type of expo icons to use
 * @param onPress A function to call when the user presses on the button
 * @param style The style for the component
 * @param name The name of the icon from expo
 * @param size The size of the button
 * @param color The color of the icon - default is black
 */
export function IconButton({ type, onPress, style, name, size, color = "black" }: { type: "Ionicons" | "FontAwesome" | "AntDesign", onPress: () => void, style: StyleProp<ViewStyle>, name: string, size: number, color?: string}) {
    let icon = <Ionicons name={name} size={size} color={color} />;
    if (type === "FontAwesome") {
        icon = <FontAwesome name={name} size={size} color={color} />;
    }
    else if (type === "AntDesign") {
        icon = <AntDesign name={name} size={size} color={color} />;
    }
    
    return (
        <TouchableOpacity style={[style]} onPress={onPress} >
            {icon}
        </TouchableOpacity>
    )
}