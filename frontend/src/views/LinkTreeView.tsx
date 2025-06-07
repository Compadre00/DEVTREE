import { useEffect, useState } from "react";
import { social } from "../data/social";
import DevTreeInput from "../components/DevTreeInput"; // Adjust the path as needed
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import { SocialNetwork, User } from "../types";

export default function LinkTreeView() {

    const [devTreeLinks, setDevTreeLinks] = useState(social);

    const queryClient = useQueryClient();
    const user : User = queryClient.getQueryData(['user'])!;    

    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Perfil actualizado");
        }
    })

    useEffect(() => {
        const updatedData = devTreeLinks.map(item => {
         const userlink = JSON.parse(user.links).find(( link: SocialNetwork ) => link.name === item.name)
            if (userlink) {
                return { ...item, url: userlink.url, enabled: userlink.enabled };
            } else {
                return item;
            }
        })
        setDevTreeLinks(updatedData);
    },[])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === e.target.name) {
                return { ...link, url: e.target.value };
            } else {
                return link;
            }
        });
        setDevTreeLinks(updatedLinks);
    }

    const links : SocialNetwork[] = JSON.parse(user.links);

    const handleEnableLink = (socialNetrowk: String) => {
        const updatedLinks = devTreeLinks.map(link => {
            if (link.name === socialNetrowk) {
                if (isValidUrl(link.url)) {
                    return { ...link, enabled: !link.enabled };
                } else {
                    toast.error("URL no valida")
                }
            }
            return link;
        });

        setDevTreeLinks(updatedLinks);

        let updatedItems : SocialNetwork[] = [];

        const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetrowk);
        if (selectedSocialNetwork?.enabled) {
            // Encuentra el id del nuevo elemento
            // Aquellos que son mayores a 0 son los que ya existen
            const id = links.filter(link => link.id).length + 1;
            if (links.some( link => link.name === socialNetrowk)) {
                updatedItems = links.map(link => {
                    if (link.name === socialNetrowk) {
                        return {
                            ...link,
                            id: id,
                            enabled: true
                        }
                    } else {
                        return link;
                    }
                })
                
            } else {
            const newItem = {
                ...selectedSocialNetwork,
                id: id
                }
                updatedItems = [...links, newItem];
            }
        } else {
            const indexToUpdate = links.findIndex(link => link.name === socialNetrowk);
            updatedItems = links.map( link => {
                if (link.name === socialNetrowk) {
                    return {
                        ...link,
                        id: 0,
                        enabled: false
                    }
                } else if (link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)) {
                    return {
                        ...link,
                        id: link.id - 1
                    }
                } else {
                    return link;
                }

            })
        }
            
        console.log("updatedItems", updatedItems);
        
        
        // Update the user data in the query client
        // This is a workaround to avoid mutating the original user object
        // and to ensure that the query client has the latest data
        queryClient.setQueryData(['user'], (prevData: User) => {
            return { 
                ...prevData, 
                links: JSON.stringify(updatedItems)
            }
        })
    }

    return (
        <div className="space-y-5">
            {devTreeLinks.map(item => (
                <DevTreeInput
                    key={item.name}
                    item={item}
                    handleUrlChange={handleUrlChange}
                    handleEnableLink={handleEnableLink}
                />
            ))}

            <button 
            className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
            onClick={() => mutate(queryClient.getQueryData(['user'])!)}
            >Guardar cambios</button>

        </div>
    );
}