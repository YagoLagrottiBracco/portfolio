/**
 * @file privacy.ts
 * @description The privacy notice at `/privacidade`. It describes what the code
 * actually does — change it in the same commit as any change to analytics,
 * browser storage, the newsletter or the write APIs.
 */
import type { Locale } from "@/lib/i18n"

type LocalizedText = Record<Locale, string>

export interface PrivacySection {
  title: LocalizedText
  paragraphs: LocalizedText[]
}

export const privacy = {
  updatedAt: "2026-10-17",
  title: { pt: "Privacidade", en: "Privacy", es: "Privacidad" },
  description: {
    pt: "O que este site coleta, por quê, onde fica guardado e como pedir para ver, corrigir ou apagar seus dados.",
    en: "What this site collects, why, where it is kept and how to ask to see, correct or delete your data.",
    es: "Qué recoge este sitio, por qué, dónde se guarda y cómo pedir ver, corregir o borrar tus datos.",
  },
  updated: { pt: "Atualizada em", en: "Updated on", es: "Actualizada el" },
  sections: [
    {
      title: { pt: "Quem é o responsável", en: "Who is responsible", es: "Quién es el responsable" },
      paragraphs: [
        {
          pt: "Este site é mantido por Yago Lagrotti Bracco, que decide o que é coletado aqui. Para qualquer pedido sobre seus dados, escreva para o e-mail no fim desta página.",
          en: "This site is run by Yago Lagrotti Bracco, who decides what is collected here. For any request about your data, write to the email address at the end of this page.",
          es: "Este sitio lo mantiene Yago Lagrotti Bracco, que decide qué se recoge aquí. Para cualquier solicitud sobre tus datos, escribe al correo que aparece al final de esta página.",
        },
      ],
    },
    {
      title: { pt: "Estatísticas de visita", en: "Visit statistics", es: "Estadísticas de visitas" },
      paragraphs: [
        {
          pt: "Para saber quais páginas são lidas e de onde vêm as visitas, o site usa o Umami e a Vercel Web Analytics. Nenhum dos dois usa cookies. Eles registram a página vista, o site ou link de origem (incluindo parâmetros UTM), o país, o tipo de navegador e de dispositivo, e cliques como os de contato, download do currículo e compartilhamento.",
          en: "To learn which pages are read and where visits come from, the site uses Umami and Vercel Web Analytics. Neither uses cookies. They record the page viewed, the referring site or link (UTM parameters included), the country, the browser and device type, and clicks such as contact, résumé download and sharing.",
          es: "Para saber qué páginas se leen y de dónde vienen las visitas, el sitio usa Umami y Vercel Web Analytics. Ninguno de los dos usa cookies. Registran la página vista, el sitio o enlace de origen (parámetros UTM incluidos), el país, el tipo de navegador y de dispositivo, y clics como los de contacto, descarga del currículum y compartir.",
        },
        {
          pt: "Os relatórios mostram números agregados, não pessoas. A Vercel Speed Insights mede o tempo de carregamento das páginas da mesma forma.",
          en: "The reports show aggregate numbers, not people. Vercel Speed Insights measures page load times the same way.",
          es: "Los informes muestran cifras agregadas, no personas. Vercel Speed Insights mide el tiempo de carga de las páginas de la misma forma.",
        },
      ],
    },
    {
      title: { pt: "O que fica no seu navegador", en: "What stays in your browser", es: "Lo que queda en tu navegador" },
      paragraphs: [
        {
          pt: "O site guarda no próprio navegador o tema que você escolheu (theme), o idioma que você escolheu (locale, também num cookie para o servidor responder no seu idioma) e a origem da sua primeira visita e da visita atual (attribution:first e attribution:session). A origem só sai do navegador junto com os cliques contados nas estatísticas, para saber qual link trouxe quem entrou em contato.",
          en: "The site keeps in your own browser the theme you picked (theme), the language you picked (locale, also in a cookie so the server answers in your language) and the source of your first and current visit (attribution:first and attribution:session). The source only leaves the browser with the clicks counted in the statistics, to learn which link brought the people who got in touch.",
          es: "El sitio guarda en tu propio navegador el tema que elegiste (theme), el idioma que elegiste (locale, también en una cookie para que el servidor responda en tu idioma) y el origen de tu primera visita y de la actual (attribution:first y attribution:session). El origen solo sale del navegador junto con los clics contados en las estadísticas, para saber qué enlace trajo a quien se puso en contacto.",
        },
        {
          pt: "Você pode apagar tudo isso a qualquer momento limpando os dados do site no navegador.",
          en: "You can erase all of it at any time by clearing the site's data in your browser.",
          es: "Puedes borrarlo todo en cualquier momento limpiando los datos del sitio en el navegador.",
        },
      ],
    },
    {
      title: { pt: "Newsletter", en: "Newsletter", es: "Newsletter" },
      paragraphs: [
        {
          pt: "Se você se inscrever, o e-mail, o idioma, a página e a origem da inscrição são guardados no Buttondown, que envia a newsletter. O Buttondown também recebe o endereço IP da inscrição, para barrar spam e estimar a localização. A inscrição só vale depois que você confirma pelo e-mail, e todo envio tem um link para cancelar.",
          en: "If you subscribe, your email address, language, the page and the source of the signup are stored at Buttondown, which sends the newsletter. Buttondown also receives the signup's IP address, to block spam and estimate location. The subscription only starts once you confirm it by email, and every issue has an unsubscribe link.",
          es: "Si te suscribes, tu correo, idioma, la página y el origen de la suscripción se guardan en Buttondown, que envía la newsletter. Buttondown también recibe la dirección IP de la suscripción, para frenar el spam y estimar la ubicación. La suscripción solo vale después de que la confirmes por correo, y cada envío tiene un enlace para darte de baja.",
        },
      ],
    },
    {
      title: { pt: "Formulários de briefing e depoimento", en: "Brief and testimonial forms", es: "Formularios de briefing y testimonio" },
      paragraphs: [
        {
          pt: "O que você escreve nesses formulários, com nome, e-mail e a origem da sua visita, é enviado por e-mail à caixa de entrada de Yago pelo Resend e não fica guardado no site. Serve só para responder ou, no caso de um depoimento, para publicá-lo com a autorização que você marcou, depois de confirmar com você.",
          en: "What you write in these forms, with your name, email and the source of your visit, is emailed to Yago's inbox through Resend and is not stored on the site. It is used only to reply or, for a testimonial, to publish it with the permission you ticked, after checking with you.",
          es: "Lo que escribes en estos formularios, con tu nombre, correo y el origen de tu visita, se envía por correo a la bandeja de Yago mediante Resend y no se guarda en el sitio. Solo se usa para responder o, en el caso de un testimonio, para publicarlo con la autorización que marcaste, tras confirmarlo contigo.",
        },
      ],
    },
    {
      title: { pt: "Contato e serviços externos", en: "Contact and external services", es: "Contacto y servicios externos" },
      paragraphs: [
        {
          pt: "Os botões de Calendly, WhatsApp, LinkedIn e e-mail levam a serviços de terceiros. O que você envia por eles segue a política de privacidade de cada um.",
          en: "The Calendly, WhatsApp, LinkedIn and email buttons lead to third-party services. Whatever you send through them follows each one's privacy policy.",
          es: "Los botones de Calendly, WhatsApp, LinkedIn y correo llevan a servicios de terceros. Lo que envíes por ellos se rige por la política de privacidad de cada uno.",
        },
      ],
    },
    {
      title: { pt: "Segurança", en: "Security", es: "Seguridad" },
      paragraphs: [
        {
          pt: "As partes do site que gravam dados (a publicação de artigos, o editor e a inscrição na newsletter) registram o endereço IP e o horário de cada tentativa, para conter abusos. Esses registros ficam nos logs da hospedagem, a Vercel, por pouco tempo.",
          en: "The parts of the site that write data (article publishing, the editor and the newsletter signup) log the IP address and time of each attempt, to stop abuse. Those records stay in the hosting provider's logs, at Vercel, for a short time.",
          es: "Las partes del sitio que guardan datos (la publicación de artículos, el editor y la suscripción a la newsletter) registran la dirección IP y la hora de cada intento, para frenar abusos. Esos registros quedan en los logs del proveedor de hosting, Vercel, por poco tiempo.",
        },
      ],
    },
    {
      title: { pt: "Bases legais e seus direitos", en: "Legal bases and your rights", es: "Bases legales y tus derechos" },
      paragraphs: [
        {
          pt: "As estatísticas e os registros de segurança se apoiam no legítimo interesse de entender o uso do site e protegê-lo; a newsletter, no seu consentimento, que você pode retirar a qualquer momento. Pela LGPD, você pode pedir para saber quais dados existem sobre você, corrigi-los ou apagá-los.",
          en: "The statistics and security logs rest on the legitimate interest of understanding how the site is used and protecting it; the newsletter rests on your consent, which you can withdraw at any time. Under Brazil's LGPD you can ask what data exists about you, and have it corrected or deleted.",
          es: "Las estadísticas y los registros de seguridad se basan en el interés legítimo de entender el uso del sitio y protegerlo; la newsletter, en tu consentimiento, que puedes retirar en cualquier momento. Según la LGPD de Brasil, puedes pedir saber qué datos existen sobre ti, corregirlos o borrarlos.",
        },
      ],
    },
  ] satisfies PrivacySection[],
  contact: { pt: "Pedidos sobre seus dados:", en: "Requests about your data:", es: "Solicitudes sobre tus datos:" },
}
