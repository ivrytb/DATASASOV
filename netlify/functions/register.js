exports.handler = async (event) => {
    try {
        // פירוק הנתונים שמגיעים מימות המשיח
        let params = {};
        if (event.body) {
            const pairs = event.body.split('&');
            for (let pair of pairs) {
                const [key, value] = pair.split('=');
                params[key] = decodeURIComponent(value || "");
            }
        }

        // נתונים שהצטברו בשיחה
        const userId = params.user_id; // תעודת זהות
        const userAge = params.user_age; // גיל
        const phone = params.ApiPhone; // טלפון של המשתמש

        // --- ניהול הדיאלוג החכם ---

        // שלב א: אם עדיין אין תעודת זהות - נבקש אותה
        if (!userId) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-נא הקש תעודת זהות בסיום הקש סולמית=user_id,no,9,9,7,Digits"
            };
        }

        // שלב ב: אם יש תעודת זהות אבל עדיין אין גיל - נבקש גיל
        if (!userAge) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                // שים לב: אנחנו שולחים בחזרה את ה-user_id כדי שלא ילך לאיבוד!
                body: `read=t-נא הקש את גילך=user_age,no,1,3,7,Digits&user_id=${userId}`
            };
        }

        // שלב ג: יש לנו הכל! כאן נבצע את הרישום
        // הערה: כרגע זה רק מחזיר הודעת אישור. בשלב הבא נחבר את זה לבסיס הנתונים.
        
        const summary = `נרשמת בהצלחה. תעודת זהות ${userId} גיל ${userAge}`;
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: `id_list_message=t-${summary}&hangup=yes`
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "id_list_message=t-חלה שגיאה במערכת הרישום"
        };
    }
};
