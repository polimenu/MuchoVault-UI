import { prettyPrintJson } from 'pretty-print-json';


export const OnRampAdminJsonDetails = ({ data }: { data: any }) => {
  return <div>
    <pre className='json-container !text-f14 h-[20vw] oauto' dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(data) }}>
    </pre>
  </div>;

}

