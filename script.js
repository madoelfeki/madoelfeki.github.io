async function downloadVCard() {
    try {
        // Load the profile photo
        const response = await fetch("mohammed-elfeki.png");

        if (!response.ok) {
            throw new Error("Could not load profile photo.");
        }

        // Read the original image
        const sourceBlob = await response.blob();

        // Decode image
        const image = await createImageBitmap(sourceBlob);

        // Create a small canvas for the contact photo
        const maxWidth = 240;
        const maxHeight = 300;

        const scale = Math.min(
            maxWidth / image.width,
            maxHeight / image.height,
            1
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.max(
            1,
            Math.round(image.width * scale)
        );

        canvas.height = Math.max(
            1,
            Math.round(image.height * scale)
        );

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Could not create image canvas.");
        }

        // Draw the resized image
        context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Convert to compressed JPEG
        const optimizedPhotoBlob = await new Promise(
            (resolve, reject) => {

                canvas.toBlob(
                    blob => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(
                                new Error(
                                    "Could not optimize profile photo."
                                )
                            );
                        }
                    },
                    "image/jpeg",
                    0.72
                );

            }
        );

        // Convert JPEG to Base64
        const base64Image = await new Promise(
            (resolve, reject) => {

                const reader = new FileReader();

                reader.onload = () => {

                    const result =
                        String(reader.result || "");

                    const commaIndex =
                        result.indexOf(",");

                    resolve(
                        commaIndex >= 0
                            ? result.slice(commaIndex + 1)
                            : result
                    );
                };

                reader.onerror = () => {
                    reject(
                        new Error(
                            "Could not encode profile photo."
                        )
                    );
                };

                reader.readAsDataURL(
                    optimizedPhotoBlob
                );
            }
        );

        image.close();

        // Build vCard
        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "N:Elfeki;Eng. Mohammed;;;",
            "FN:Eng. Mohammed Elfeki",
            "ORG:National Airspace Management Center (NASMC)",
            "TITLE:Computer Engineer",
            "TEL;TYPE=CELL,VOICE:+201001313915",
            "EMAIL;TYPE=INTERNET:mohammed.feki@gmail.com",
            "URL;TYPE=Portfolio:https://madoelfeki.github.io",
            "URL;TYPE=LinkedIn:https://www.linkedin.com/in/mohammedelfeki",
            "URL;TYPE=GitHub:https://github.com/madoelfeki",
            "URL;TYPE=WhatsApp:https://wa.me/201001313915",
            "URL;TYPE=Instagram:https://www.instagram.com/madoelfeki",
            "URL;TYPE=Facebook:https://www.facebook.com/mado.feki",
            "NOTE:Cybersecurity | DevOps | IT Infrastructure | Automation",
            `PHOTO;ENCODING=b;TYPE=JPEG:${base64Image}`,
            "END:VCARD"
        ].join("\r\n");

        // Create the downloadable contact file
        const vCardBlob = new Blob(
            [vCard],
            {
                type: "text/vcard;charset=utf-8"
            }
        );

        const url =
            URL.createObjectURL(vCardBlob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = "Eng.Mohammed_Elfeki.vcf";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    } catch (error) {

        console.error(
            "vCard generation failed:",
            error
        );

        alert(
            "Unable to create the contact card. Please try again."
        );
    }
}
