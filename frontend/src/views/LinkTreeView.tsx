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
        queryClient.setQueryData(['user'], (prevData: User) => {
            return { 
                ...prevData, 
                links: JSON.stringify(updatedLinks)
            }
        })
    }

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

        queryClient.setQueryData(['user'], (prevData: User) => {
            return { 
                ...prevData, 
                links: JSON.stringify(updatedLinks)
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
            onClick={() => mutate(user)}
            >Guardar cambios</button>

        </div>
    );
}