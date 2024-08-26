import * as React from "react"
import { Input } from "@/components/ui/input"
import { searchUser } from "@/services/users"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User, UserSelectOption } from "@/types/user"
import useDebounce from "@/hooks/useDebounce"

export function SearchUser(
    { userData, setUserData }:
        {
            userData: UserSelectOption | null,
            setUserData: (data: UserSelectOption) => void
        }
) {
    const [search, setSearch] = React.useState("")
    const [options, setOptions] = React.useState<UserSelectOption[]>([])
    const debouncedSearch = useDebounce(search, 300)

    const handleSearch = async (query: string) => {
        try {
            const response = await searchUser(query)
            setOptions(response.map((user: User) => ({
                user_id: user.id,
                username: user.username
            })))
        } catch (error) {
            console.error("Error searching user:", error)
            setOptions([])
        }
    }

    const onValueChange = (value: string) => {
        const user = options.find(option => option.username === value)
        if (user) {
            setUserData({ user_id: user.user_id, username: user.username })
        }
    }

    React.useEffect(() => {
        if (debouncedSearch) {
            handleSearch(debouncedSearch)
        }
    }, [debouncedSearch])

    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Username" />
            </SelectTrigger>
            <SelectContent>
                <Input
                    value={search}
                    placeholder="Find user"
                    onChange={e => setSearch(e.target.value)}
                />
                {options.map((option) => (
                    <SelectItem key={option.user_id} value={option.username}>
                        {option.username}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
