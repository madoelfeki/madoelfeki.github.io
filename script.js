async function downloadVCard() {
    try {
        // Load your profile photo
        const response = await fetch("mohammed-elfeki.png");

        if (!response.ok) {
            throw new Error("Could not load profile photo.");
        }

        const imageBuffer = await response.arrayBuffer();

        // Convert image to Base64
        const bytes = new Uint8Array(imageBuffer);

        let binary = "";

        const chunkSize = 0x8000;

        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(
                ...bytes.subarray(i, i + chunkSize)
            );
        }

        const base64Image = btoa(binary);

        // vCard
        const vCard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "N:Elfeki;Mohammed;;;",
            "FN:Mohammed Elfeki",
            "TITLE:Computer Engineer | Cybersecurity | DevOps",
            "TEL;TYPE=CELL,VOICE:+201001313915",
            "EMAIL;TYPE=INTERNET:mohammed.feki@gmail.com",
            "URL;TYPE=LinkedIn:https://www.linkedin.com/in/mohammedelfeki",
            "URL;TYPE=GitHub:https://github.com/madoelfeki",
            "URL;TYPE=WhatsApp:https://wa.me/201001313915",
            "URL;TYPE=Instagram:https://www.instagram.com/madoelfeki",
            "URL;TYPE=Facebook:https://www.facebook.com/mado.feki",
            "NOTE:Mindset for Engineering. Function & Structure.",
            `PHOTO;ENCODING=b;TYPE=PNG:${base64Image}`,
            "END:VCARD"
        ].join("\r\n");

        // Create downloadable VCF file
        const blob = new Blob(
            [vCard],
            { type: "text/vcard;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Mohammed_Elfeki.vcf";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("vCard generation failed:", error);

        alert(
            "Unable to create the contact card. Please make sure the profile photo is available."
        );
    }
}
