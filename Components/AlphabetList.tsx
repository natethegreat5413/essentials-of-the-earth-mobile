import { SectionList, TouchableOpacity, Text, View, SectionListData, DefaultSectionT, PanResponder, Platform, SectionListProps } from "react-native";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import * as Haptics from 'expo-haptics';
import { SearchBar } from "./SearchBar";
import colors from "../Constants/Colors";


export const ITEM_HEIGHT = 45;
export const HEAD_HEIGHT = 30;


type ISection = readonly SectionListData<{ value: string, key: string }, DefaultSectionT>[];
type IRowData = { value: string, key: string }
interface AlphabetListProps<IRowData> extends SectionListProps<IRowData> {
    searchPlaceholder?: string;
    onRowPress: (value: string) => void;
    hideAlphaLetters?: boolean;
}
type Alphabet = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export const alphaLetters: Alphabet[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export type AlphaSection<T> = Array<{
    title: Alphabet,
    data: { value: string, key: string, info: T }[],
}>;

export function getEmptyAlphaSection<T>(): AlphaSection<T> {
    return alphaLetters.map(letter => ({
        title: letter,
        data: [],
    }))
}

export function getAlphaIndex(letter: string): number {
    return letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
}



/**
 * Creates a sectioned list (by alphabet)
 * @param sections - The different sections of the list. Each section must be a capital letter of the alphabet.
 * @param onRowPress - The function to call when the user presses on a row
 */
export function AlphabetList( { sections, onRowPress, searchPlaceholder, hideAlphaLetters, ...props }: AlphabetListProps<IRowData> ) {
    const ref = useRef<SectionList<string>>() as MutableRefObject<SectionList>;

    const [filteredSections, setFilteredSections] = useState(sections);
    const [search, setSearch] = useState("");

    // This use effect is necessary so that when the sections changes outside of this component
    // The filtered sections will also update. For example, the all concerns screen will get the
    // the data after the component has rendered and change the section content from nothing to 
    // everything, and without this use effect that new content won't be updated.
    useEffect(() => {
        setFilteredSections(sections)
    }, [sections])

    /**
     * Searches the sections from a search string
     * @param text The text to search with
     */
    function onSearch(text: string) {
        setSearch(text);

        // Filter the sections
        const filtered = sections.map(section => ({
            ...section,
            data: section.data.filter(item => item.value.toLowerCase().includes(text.toLowerCase()))
        })).filter(section => section.data.length > 0);
        // This conditional statement is necessary so that when there is no data that matches the 
        // search text the keyboard won't un-focus (because the section list rerenders when the list 
        // becomes empty).
        if (filtered.length > 0) {
            setFilteredSections(filtered);
        }
        else {
            setFilteredSections([{ key: "", data: []}])
        }
    }


    // RENDER THE COMPONENTS USING A USE CALLBACK FUNCTION TO MAKE THEM PURE COMPONENTS
    // This means that when one thing updates or changes these components won't.
    // This allows for fast response times and updates.

    const renderItem = useCallback(({ item }:  { item: { key: string, value: string }}) => (
        <TouchableOpacity key={item.key} onPress={() => onRowPress(item.value)} style={{ justifyContent: "center", flex: 1, height: ITEM_HEIGHT, paddingHorizontal: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }} numberOfLines={2} >{item.value}</Text>
        </TouchableOpacity>
    ), [sections]);

    const renderSeparator = useCallback(() => <View style={{ flex: 1, borderTopWidth: 0.5, borderColor: "#999", height: 1 }} />, [])

    const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string }}) => (
        <View style={{ padding: 5, justifyContent: "center", flex: 1, backgroundColor: "#ddd", height: HEAD_HEIGHT, opacity: title ? 1 : 0 }}>
            <Text>{title}</Text>
        </View>), []);


    return <View style={{ justifyContent: "center", height: "100%", width: "100%" }}>
        <SectionList 
            ref={ref}
            sections={filteredSections}
            contentOffset={{ x: 0, y: 60 }}
            contentContainerStyle={{ paddingBottom: 50 }}
            // Make rendering as efficient as possible
            removeClippedSubviews  maxToRenderPerBatch={3} windowSize={2} initialNumToRender={20} updateCellsBatchingPeriod={200}
            renderItem={renderItem} renderSectionHeader={renderSectionHeader as any} ItemSeparatorComponent={renderSeparator}
            ListHeaderComponent={<SearchBar value={search} onChangeText={onSearch} placeholder={searchPlaceholder} spellCheck={false} />}
            // Allows for the alpha letters to the side.
            getItemLayout={sectionListGetItemLayout({
                getItemHeight: () => ITEM_HEIGHT,
                getSectionHeaderHeight: () => HEAD_HEIGHT,
                getSeparatorHeight: () => 1,
                listHeaderHeight: () => 60,
            }) as any}
            {...props}
        />
        { !hideAlphaLetters && filteredSections.length > 0 && <AlphaLetters sectionListRef={ref} sections={filteredSections} />}
    </View>;
}




/**
 * Displays an alphabet off to the side of the list so the user can quickly scroll to a section
 * @param sectionListRef - The references to the section list
 * @param sections - The sections and their data in the list
 */
function AlphaLetters({ sectionListRef, sections }: { sectionListRef: MutableRefObject<SectionList<any, DefaultSectionT>>, sections: ISection }) {
    const alphaContainerRef = useRef<View>() as MutableRefObject<View>;
    const [containerTop, setContainerTop] = useState(0);
    const [height, setHeight] = useState(0);
    let previousLetter = "A";

    // Create a pan responder to handle touch events
    const panResponderRef = useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove(e, gestureState) { calculateTouch(gestureState.moveY); },
            onPanResponderGrant(e, gestureState) { calculateTouch(gestureState.y0) }
        }), [sections, height, containerTop])


    function calculateTouch(y: number) {
        // Calculate where the touch on the view took place
        let touchY = y - (containerTop || 0);
        // Make sure the touch is in the range of the view
        if (touchY >= 1 && touchY < height) {
            // Calculate the index of the touch i.e. 0 = A, 2 = B, ... 25 = Z
            let index = Math.round((touchY / height) * alphaLetters.length);
            // Make sure the index is in the correct range
            if (index > 25) index = 25;
            // Scroll to the nearest alpha letter
            scrollToAlphaLocation(getClosestAlphaLetter(alphaLetters[index], sections.map(section => section.title)));
        }
    }
    /**
     * Scrolls the section list to a letter
     * @param letter The letter to scroll to
     */
    function scrollToAlphaLocation(letter: string) {
        if (previousLetter !== letter) {
            previousLetter = letter;
            Haptics.selectionAsync();
            const sectionIndex = sections.findIndex(section => section.title === letter);
            if (sectionIndex < 0) return;
            sectionListRef.current.scrollToLocation({
                sectionIndex: sectionIndex,
                itemIndex: 0,
                animated: false // Don't animate
            });
        }
    } 


    return <View 
            ref={alphaContainerRef}
            {...panResponderRef.panHandlers} 
            onLayout={(event) => { // When we render the view calculate where the top of the container is and how tall the component is
                alphaContainerRef.current.measure((x, y, w, h, px, py) => {
                    setContainerTop(py);
                    setHeight(h);
                })
            }}
            style={{ position: "absolute", alignSelf: "flex-end", alignItems: "center", flexDirection: "column", right: Platform.OS === "android" ? 5 : 0, justifyContent: "space-evenly", padding: 5 }} >
        {
            alphaLetters.map(letter => <Text style={{ fontSize: Platform.OS === "android" ? 12 : 14, color: colors.blue }}>{letter}</Text>)
        }
    </View>
}

/**
 * Returns the letter in the provided 'letters' array that is closest to the given 'letter'.
 * @param {string} letter - The target letter.
 * @param {string[]} letters - The array of letters to search through.
 * @returns {string} - The letter in the 'letters' array that is closest to the target letter.
 */
function getClosestAlphaLetter(letter: string, letters: string[]): string {
    if (letters[0] === undefined || letters === undefined || letters.length === 0) return ""; 
    
    let minDistance = Infinity; // initialize minimum distance to infinity
    let closest = letters[0]; // initialize closest letter to undefined

    for (const l of letters) {
        const distance = Math.abs(l.charCodeAt(0) - letter.charCodeAt(0)); // calculate distance between current letter and target letter
        if (distance < minDistance) { // update closest letter if distance is smaller than current minimum distance
            minDistance = distance;
            closest = l;
        } 
        else if (distance > minDistance) { // break out of the loop if we've gone past the closest letter
            break;
        }
    }

    return closest;
}