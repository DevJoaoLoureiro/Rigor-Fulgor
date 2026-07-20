import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(
        "EMAIL_USER ou EMAIL_PASS não estão configurados."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Configuration e-mail manquante.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const nome = String(formData.get("name") ?? "").trim();
    const telefone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const cidade = String(formData.get("city") ?? "").trim();
    const servico = String(formData.get("service") ?? "").trim();
    const mensagem = String(formData.get("message") ?? "").trim();
    const consentimento = formData.get("consent");

    if (
      !nome ||
      !telefone ||
      !email ||
      !cidade ||
      !servico ||
      !mensagem ||
      !consentimento
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Veuillez remplir tous les champs obligatoires.",
        },
        { status: 400 }
      );
    }

    const photoEntries = formData.getAll("photos");

    const photos = photoEntries.filter(
      (entry): entry is File =>
        entry instanceof File && entry.size > 0
    );

    if (photos.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Vous pouvez envoyer un maximum de 5 photos.",
        },
        { status: 400 }
      );
    }

    for (const photo of photos) {
      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `Le fichier "${photo.name}" n’est pas un format accepté.`,
          },
          { status: 400 }
        );
      }

      if (photo.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `La photo "${photo.name}" dépasse la limite de 5 Mo.`,
          },
          { status: 400 }
        );
      }
    }

    const attachments = await Promise.all(
      photos.map(async (photo) => {
        const arrayBuffer = await photo.arrayBuffer();

        return {
          filename: photo.name,
          content: Buffer.from(arrayBuffer),
          contentType: photo.type,
        };
      })
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const safeNome = escapeHtml(nome);
    const safeTelefone = escapeHtml(telefone);
    const safeEmail = escapeHtml(email);
    const safeCidade = escapeHtml(cidade);
    const safeServico = escapeHtml(servico);
    const safeMensagem = escapeHtml(mensagem).replaceAll(
      "\n",
      "<br />"
    );

    await transporter.sendMail({
      from: `"Site Rigor & Fulgor" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nouvelle demande de devis - ${servico} - ${nome}`,
      text: `
Nouvelle demande de devis

Nom : ${nome}
E-mail : ${email}
Téléphone : ${telefone}
Ville : ${cidade}
Service : ${servico}
Photos : ${photos.length}

Message :
${mensagem}
      `,
      html: `
        <div
          style="
            max-width: 680px;
            margin: 0 auto;
            padding: 30px;
            background: #101010;
            color: #ffffff;
            font-family: Arial, sans-serif;
            line-height: 1.6;
          "
        >
          <h1 style="margin-top: 0; color: #d4af37;">
            Nouvelle demande de devis
          </h1>

          <div
            style="
              padding: 20px;
              background: #000000;
              border: 1px solid #333333;
              border-radius: 8px;
            "
          >
            <p>
              <strong style="color: #d4af37;">Nom :</strong>
              ${safeNome}
            </p>

            <p>
              <strong style="color: #d4af37;">E-mail :</strong>
              ${safeEmail}
            </p>

            <p>
              <strong style="color: #d4af37;">Téléphone :</strong>
              ${safeTelefone}
            </p>

            <p>
              <strong style="color: #d4af37;">Ville :</strong>
              ${safeCidade}
            </p>

            <p>
              <strong style="color: #d4af37;">Service :</strong>
              ${safeServico}
            </p>

            <p>
              <strong style="color: #d4af37;">Photos :</strong>
              ${photos.length} pièce(s) jointe(s)
            </p>
          </div>

          <h2 style="margin-top: 30px; color: #d4af37;">
            Message
          </h2>

          <div
            style="
              padding: 20px;
              background: #000000;
              border: 1px solid #333333;
              border-radius: 8px;
            "
          >
            ${safeMensagem}
          </div>
        </div>
      `,
      attachments,
    });

    return NextResponse.json({
      success: true,
      message: "E-mail envoyé avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de l’envoi :", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible d’envoyer la demande. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}