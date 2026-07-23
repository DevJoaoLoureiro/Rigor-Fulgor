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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: Request) {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO ?? emailUser;
    const smtpHost = process.env.SMTP_HOST ?? "smtp.hostinger.com";
    const smtpPort = Number(process.env.SMTP_PORT ?? 465);

    if (!emailUser || !emailPass || !emailTo) {
      console.error("Configuration e-mail incomplète.");

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
          message: "Veuillez remplir tous les champs obligatoires.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Veuillez saisir une adresse e-mail valide.",
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
          message: "Vous pouvez envoyer un maximum de 5 photos.",
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
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.verify();

    const safeNome = escapeHtml(nome);
    const safeTelefone = escapeHtml(telefone);
    const safeEmail = escapeHtml(email);
    const safeCidade = escapeHtml(cidade);
    const safeServico = escapeHtml(servico);
    const safeMensagem = escapeHtml(mensagem).replaceAll("\n", "<br />");

    const safeSubjectNome = sanitizeHeader(nome);
    const safeSubjectServico = sanitizeHeader(servico);

    const replyLink = `mailto:${encodeURIComponent(
      email
    )}?subject=${encodeURIComponent(
      `Votre demande de devis - Rigor Fulgor`
    )}`;

    await transporter.sendMail({
      from: `"Rigor Fulgor — Site web" <${emailUser}>`,
      to: emailTo,
      replyTo: email,
      subject: `Nouveau devis — ${safeSubjectServico} — ${safeSubjectNome}`,

      text: `
NOUVELLE DEMANDE DE DEVIS

Client
Nom : ${nome}
E-mail : ${email}
Téléphone : ${telefone}
Ville : ${cidade}

Demande
Service : ${servico}
Photos jointes : ${photos.length}

Message
${mensagem}

Vous pouvez répondre directement à cet e-mail pour contacter le client.
      `.trim(),

      html: `
        <!doctype html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Nouvelle demande de devis</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #080808;
              color: #ffffff;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              style="background-color: #080808;"
            >
              <tr>
                <td align="center" style="padding: 32px 16px;">
                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                      max-width: 680px;
                      overflow: hidden;
                      background-color: #111111;
                      border: 1px solid #2a2a2a;
                      border-radius: 14px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 28px 32px;
                          background-color: #050505;
                          border-bottom: 1px solid #2a2a2a;
                        "
                      >
                        <p
                          style="
                            margin: 0 0 8px;
                            color: #d4af37;
                            font-size: 13px;
                            font-weight: 700;
                            letter-spacing: 2px;
                            text-transform: uppercase;
                          "
                        >
                          Rigor Fulgor
                        </p>

                        <h1
                          style="
                            margin: 0;
                            color: #ffffff;
                            font-size: 26px;
                            line-height: 1.25;
                          "
                        >
                          Nouvelle demande de devis
                        </h1>

                        <p
                          style="
                            margin: 10px 0 0;
                            color: #9d9d9d;
                            font-size: 14px;
                            line-height: 1.6;
                          "
                        >
                          Une nouvelle demande a été envoyée depuis le site.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 30px 32px;">
                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            background-color: #090909;
                            border: 1px solid #2b2b2b;
                            border-radius: 10px;
                          "
                        >
                          <tr>
                            <td style="padding: 22px;">
                              <h2
                                style="
                                  margin: 0 0 18px;
                                  color: #d4af37;
                                  font-size: 17px;
                                "
                              >
                                Informations du client
                              </h2>

                              <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                              >
                                <tr>
                                  <td
                                    style="
                                      padding: 8px 0;
                                      color: #8f8f8f;
                                      font-size: 14px;
                                      width: 130px;
                                    "
                                  >
                                    Nom
                                  </td>
                                  <td
                                    style="
                                      padding: 8px 0;
                                      color: #ffffff;
                                      font-size: 14px;
                                      font-weight: 600;
                                    "
                                  >
                                    ${safeNome}
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    style="
                                      padding: 8px 0;
                                      color: #8f8f8f;
                                      font-size: 14px;
                                    "
                                  >
                                    E-mail
                                  </td>
                                  <td style="padding: 8px 0; font-size: 14px;">
                                    <a
                                      href="mailto:${safeEmail}"
                                      style="
                                        color: #d4af37;
                                        text-decoration: none;
                                      "
                                    >
                                      ${safeEmail}
                                    </a>
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    style="
                                      padding: 8px 0;
                                      color: #8f8f8f;
                                      font-size: 14px;
                                    "
                                  >
                                    Téléphone
                                  </td>
                                  <td style="padding: 8px 0; font-size: 14px;">
                                    <a
                                      href="tel:${safeTelefone}"
                                      style="
                                        color: #ffffff;
                                        text-decoration: none;
                                      "
                                    >
                                      ${safeTelefone}
                                    </a>
                                  </td>
                                </tr>

                                <tr>
                                  <td
                                    style="
                                      padding: 8px 0;
                                      color: #8f8f8f;
                                      font-size: 14px;
                                    "
                                  >
                                    Ville
                                  </td>
                                  <td
                                    style="
                                      padding: 8px 0;
                                      color: #ffffff;
                                      font-size: 14px;
                                    "
                                  >
                                    ${safeCidade}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            margin-top: 18px;
                            background-color: #090909;
                            border: 1px solid #2b2b2b;
                            border-radius: 10px;
                          "
                        >
                          <tr>
                            <td style="padding: 22px;">
                              <h2
                                style="
                                  margin: 0 0 18px;
                                  color: #d4af37;
                                  font-size: 17px;
                                "
                              >
                                Détails de la demande
                              </h2>

                              <p
                                style="
                                  margin: 0 0 10px;
                                  color: #8f8f8f;
                                  font-size: 14px;
                                "
                              >
                                Service
                              </p>

                              <p
                                style="
                                  display: inline-block;
                                  margin: 0 0 20px;
                                  padding: 8px 12px;
                                  background-color: #1b180d;
                                  border: 1px solid #5c4b14;
                                  border-radius: 999px;
                                  color: #e4c45c;
                                  font-size: 13px;
                                  font-weight: 700;
                                "
                              >
                                ${safeServico}
                              </p>

                              <p
                                style="
                                  margin: 0 0 8px;
                                  color: #8f8f8f;
                                  font-size: 14px;
                                "
                              >
                                Photos jointes
                              </p>

                              <p
                                style="
                                  margin: 0;
                                  color: #ffffff;
                                  font-size: 14px;
                                "
                              >
                                ${photos.length} photo(s)
                              </p>
                            </td>
                          </tr>
                        </table>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            margin-top: 18px;
                            background-color: #090909;
                            border: 1px solid #2b2b2b;
                            border-radius: 10px;
                          "
                        >
                          <tr>
                            <td style="padding: 22px;">
                              <h2
                                style="
                                  margin: 0 0 14px;
                                  color: #d4af37;
                                  font-size: 17px;
                                "
                              >
                                Message
                              </h2>

                              <div
                                style="
                                  color: #e7e7e7;
                                  font-size: 15px;
                                  line-height: 1.75;
                                  word-break: break-word;
                                "
                              >
                                ${safeMensagem}
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table
                          role="presentation"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="margin-top: 24px;"
                        >
                          <tr>
                            <td align="center">
                              <a
                                href="${replyLink}"
                                style="
                                  display: inline-block;
                                  padding: 14px 24px;
                                  background-color: #d4af37;
                                  color: #050505;
                                  border-radius: 8px;
                                  font-size: 14px;
                                  font-weight: 700;
                                  text-decoration: none;
                                "
                              >
                                Répondre au client
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td
                        align="center"
                        style="
                          padding: 20px 32px;
                          background-color: #080808;
                          border-top: 1px solid #242424;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            color: #686868;
                            font-size: 12px;
                            line-height: 1.6;
                          "
                        >
                          Message envoyé automatiquement depuis le formulaire
                          du site Rigor Fulgor.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
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