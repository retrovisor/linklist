import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Chart from "@/components/Chart";
import SectionBox from "@/components/layout/SectionBox";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isToday } from "date-fns";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { performDatabaseOperation } from "@/libs/mongoClient";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  }

  try {
    const page = await performDatabaseOperation(async (db) => {
      return await db.collection("pages").findOne({ owner: session.user.id });
    });

    if (!page) {
      return (
        <div>
          <p className="text-center text-gray-500">No page found for the current user.</p>
        </div>
      );
    }

    const [groupedViews, clicks] = await performDatabaseOperation(async (db) => {
      const groupedViewsResult = await db.collection("events").aggregate([
        {
          $match: {
            type: 'view',
            uri: page.uri,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                date: "$createdAt",
                format: "%Y-%m-%d",
              },
            },
            count: { $count: {} },
          },
        },
        { $sort: { _id: 1 } },
      ]).toArray();

      const clicksResult = await db.collection("events").find({
        page: page.uri,
        type: 'click',
      }).toArray();

      return [groupedViewsResult, clicksResult];
    });

    return (
      <div>
        <SectionBox>
          <h2 className="text-xl mb-6 text-center">Views</h2>
          {groupedViews.length > 0 ? (
            <Chart
              data={groupedViews.map((o) => ({
                date: o._id,
                views: o.count,
              }))}
            />
          ) : (
            <p className="text-center text-gray-500">No views data available.</p>
          )}
        </SectionBox>
        <SectionBox>
          <h2 className="text-xl mb-6 text-center">Clicks</h2>
          {page.links.map((link) => (
            <div key={link.title} className="md:flex gap-4 items-center border-t border-gray-200 py-4">
              <div className="text-blue-500 pl-4">
                <FontAwesomeIcon icon={faLink} />
              </div>
              <div className="grow">
                <h3>{link.title || 'no title'}</h3>
                <p className="text-gray-700 text-sm">{link.subtitle || 'no description'}</p>
                <a className="text-xs text-blue-400" target="_blank" href={link.url}>{link.url}</a>
              </div>
              <div className="text-center">
                <div className="border rounded-md p-2 mt-1 md:mt-0">
                  <div className="text-3xl">
                    {clicks.filter((c) => c.uri === link.url && isToday(new Date(c.createdAt))).length}
                  </div>
                  <div className="text-gray-400 text-xs uppercase font-bold">clicks today</div>
                </div>
              </div>
              <div className="text-center">
                <div className="border rounded-md p-2 mt-1 md:mt-0">
                  <div className="text-3xl">{clicks.filter((c) => c.uri === link.url).length}</div>
                  <div className="text-gray-400 text-xs uppercase font-bold">clicks total</div>
                </div>
              </div>
            </div>
          ))}
        </SectionBox>
      </div>
    );
  } catch (error) {
    console.error('Error in AnalyticsPage:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
